"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { toTitleCase } from "@/app/lib/validation";
import { useSettings } from "@/app/hooks/useSettings";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ItemForm {
  name: string;
  unit: string;
  totalQuantity: string;
  price: string;
  notes: string;
  errors: {
    name: string;
    unit: string;
    totalQuantity: string;
    price: string;
    notes: string;
  };
}

const createEmptyItem = (): ItemForm => ({
  name: "",
  unit: "pcs",
  totalQuantity: "",
  price: "",
  notes: "",
  errors: {
    name: "",
    unit: "",
    totalQuantity: "",
    price: "",
    notes: "",
  },
});

export default function AddItemModal({
  isOpen,
  onClose,
  onSuccess,
}: AddItemModalProps) {
  const { settings } = useSettings();
  const [items, setItems] = useState<ItemForm[]>([createEmptyItem()]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const validateItem = (item: ItemForm): boolean => {
    const errors = {
      name: "",
      unit: "",
      totalQuantity: "",
      price: "",
      notes: "",
    };
    let isValid = true;

    // Name validation
    if (!item.name.trim()) {
      errors.name = "*Item name is required";
      isValid = false;
    } else if (item.name.trim().length < 2) {
      errors.name = "*Item name must be at least 2 characters";
      isValid = false;
    } else if (item.name.length > 50) {
      errors.name = "*Item name must be 50 characters or less";
      isValid = false;
    }

    // Unit validation
    if (!item.unit.trim()) {
      errors.unit = "*Unit is required";
      isValid = false;
    } else if (item.unit.trim().length < 2) {
      errors.unit = "*Unit must be at least 2 characters";
      isValid = false;
    } else if (item.unit.length > 16) {
      errors.unit = "*Unit must be 16 characters or less";
      isValid = false;
    } else if (!/^[a-z\s]+$/.test(item.unit)) {
      errors.unit = "*Enter letters only (no numbers)";
      isValid = false;
    }

    // Quantity validation
    if (!item.totalQuantity.trim()) {
      errors.totalQuantity = "*Quantity is required";
      isValid = false;
    } else {
      const qty = Number(item.totalQuantity);
      if (isNaN(qty)) {
        errors.totalQuantity = "*Enter a numeric quantity";
        isValid = false;
      } else if (qty < 0) {
        errors.totalQuantity = "*Quantity must be 0 or greater";
        isValid = false;
      } else if (qty > 100000) {
        errors.totalQuantity = "*Quantity cannot exceed 100,000";
        isValid = false;
      }
    }

    // Price validation (optional)
    if (item.price.trim()) {
      const price = parseFloat(item.price);
      if (isNaN(price)) {
        errors.price = "*Enter a valid price";
        isValid = false;
      } else if (!/^\d+(\.\d{1,2})?$/.test(item.price)) {
        errors.price = "*Max 2 decimal places";
        isValid = false;
      } else if (price > 1000000) {
        errors.price = "*Price cannot exceed 1,000,000";
        isValid = false;
      }
    }

    // Notes validation (optional)
    if (item.notes.length > 50) {
      errors.notes = "*Maximum 50 characters";
      isValid = false;
    }

    // Update item errors
    const newItems = [...items];
    const index = items.indexOf(item);
    newItems[index] = { ...item, errors };
    setItems(newItems);

    return isValid;
  };

  const handleAddItem = () => {
    if (items.length < 5) {
      setItems([...items, createEmptyItem()]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length === 0 ? [createEmptyItem()] : newItems);
  };

  const handleFieldChange = (index: number, field: keyof Omit<ItemForm, 'errors'>, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      errors: { ...newItems[index].errors, [field]: "" }, // Clear error on change
    };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError("");

    // Validate all items
    let allValid = true;
    for (const item of items) {
      if (!validateItem(item)) {
        allValid = false;
      }
    }

    if (!allValid) {
      setGlobalError("Please fix all errors before submitting");
      return;
    }

    setLoading(true);

    try {
      // Create all items
      for (const item of items) {
        const response = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: toTitleCase(item.name.trim()),
            unit: item.unit.trim(),
            totalQuantity: parseInt(item.totalQuantity),
            price: item.price.trim() ? parseFloat(item.price) : undefined,
            notes: item.notes.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to create item" }));
          throw new Error(errorData.error || `Failed to create item: ${item.name}`);
        }
      }

      // Reset and close
      setItems([createEmptyItem()]);
      onSuccess();
      onClose();
    } catch (err: any) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const canAddMore = items.length < 5 && items[items.length - 1]?.name.trim() && items[items.length - 1]?.totalQuantity.trim();

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 transform transition-all max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-black">Add New Items</h3>
              <p className="text-[10px] font-bold text-purple-600 mt-0.5">
                Maximum 5 items only ({items.length}/5)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {globalError && (
              <div className="bg-red-50 text-red-600 p-2 rounded text-sm font-semibold">
                {globalError}
              </div>
            )}

            {items.map((item, index) => (
              <div key={index} className="border-2 border-gray-300 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="w-5 h-5 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded transition-colors"
                    title="Remove item"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Item Name */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-black">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    maxLength={50}
                    className={`w-full px-2 py-1.5 border-2 ${
                      item.errors.name ? "border-red-500 ring-2 ring-red-500/40" : "border-gray-400"
                    } rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-semibold text-sm`}
                    placeholder="Enter item name"
                  />
                  {item.errors.name && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{item.errors.name}</p>
                  )}
                </div>

                {/* Unit and Quantity */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-black">
                      Unit *
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z\s]/g, '');
                        handleFieldChange(index, 'unit', value);
                      }}
                      maxLength={16}
                      className={`w-full px-2 py-1.5 border-2 ${
                        item.errors.unit ? "border-red-500 ring-2 ring-red-500/40" : "border-gray-400"
                      } rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-semibold text-sm`}
                      placeholder="pcs"
                    />
                    {item.errors.unit && (
                      <p className="mt-1 text-xs font-semibold text-red-600">{item.errors.unit}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-black">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={item.totalQuantity}
                      onChange={(e) => handleFieldChange(index, 'totalQuantity', e.target.value)}
                      min="0"
                      max="100000"
                      className={`w-full px-2 py-1.5 border-2 ${
                        item.errors.totalQuantity ? "border-red-500 ring-2 ring-red-500/40" : "border-gray-400"
                      } rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-semibold text-sm`}
                      placeholder="0"
                    />
                    {item.errors.totalQuantity && (
                      <p className="mt-1 text-xs font-semibold text-red-600">{item.errors.totalQuantity}</p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <label className="block text-xs font-semibold mb-1 text-green-800">
                    Price for each item (Optional)
                  </label>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center justify-center h-9 px-2 bg-white border-2 border-gray-400 rounded-l">
                      <span className="text-green-600 font-bold text-sm">
                        {settings?.currencySymbol || "₦"}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => handleFieldChange(index, 'price', e.target.value)}
                      className={`flex-1 h-9 px-2 border-2 ${
                        item.errors.price ? "border-red-500 ring-2 ring-red-500/40" : "border-gray-400"
                      } rounded-r focus:ring-2 focus:ring-blue-500 outline-none text-black font-semibold text-sm`}
                      placeholder="0.00"
                    />
                  </div>
                  {item.errors.price && (
                    <p className="mt-1 text-xs font-semibold text-red-600">{item.errors.price}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-black">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => handleFieldChange(index, 'notes', e.target.value)}
                    maxLength={50}
                    className={`w-full px-2 py-1.5 border-2 ${
                      item.errors.notes ? "border-red-500 ring-2 ring-red-500/40" : "border-gray-400"
                    } rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-semibold text-sm`}
                    placeholder="Optional notes"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {item.errors.notes ? (
                      <p className="text-xs font-semibold text-red-600">{item.errors.notes}</p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-[9px] text-gray-600">{item.notes.length}/50</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Item Button */}
            {items.length < 5 && (
              <button
                type="button"
                onClick={handleAddItem}
                disabled={!canAddMore}
                className={`w-full text-xs flex items-center justify-center gap-1 py-2 border-2 border-dashed rounded-lg transition-all ${
                  canAddMore
                    ? "border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold"
                    : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Plus className="w-4 h-4" /> Add another item (max 5)
              </button>
            )}
          </form>

          <div className="flex gap-2 p-4 border-t flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? "Adding..." : `Add ${items.length} Item${items.length > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
