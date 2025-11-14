import { useState, useEffect, useCallback } from 'react';

export interface Item {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price: number;
  quantity: number;
  color?: string;
}

export interface UseItemsReturn {
  items: Item[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage inventory items
 * @returns Items data, loading state, error state, and refetch function
 */
export function useItems(): UseItemsReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/items');

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refetch: fetchItems,
  };
}
