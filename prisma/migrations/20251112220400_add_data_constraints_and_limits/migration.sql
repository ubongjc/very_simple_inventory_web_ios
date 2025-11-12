-- AlterTable: Add length constraints and change types for Item
ALTER TABLE "Item" ALTER COLUMN "name" SET DATA TYPE VARCHAR(80);
ALTER TABLE "Item" ALTER COLUMN "unit" SET DATA TYPE VARCHAR(16);
ALTER TABLE "Item" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(50);
ALTER TABLE "Item" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable: Add length constraints for Customer
ALTER TABLE "Customer" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(50);
ALTER TABLE "Customer" ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50);
ALTER TABLE "Customer" ALTER COLUMN "phone" SET DATA TYPE VARCHAR(15);
ALTER TABLE "Customer" ALTER COLUMN "email" SET DATA TYPE VARCHAR(254);
ALTER TABLE "Customer" ALTER COLUMN "address" SET DATA TYPE VARCHAR(200);
ALTER TABLE "Customer" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(50);

-- AlterTable: Add length constraints and change types for Booking (Rental)
ALTER TABLE "Rental" ALTER COLUMN "status" SET DATA TYPE VARCHAR(20);
ALTER TABLE "Rental" ALTER COLUMN "reference" SET DATA TYPE VARCHAR(12);
ALTER TABLE "Rental" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(50);
ALTER TABLE "Rental" ALTER COLUMN "color" SET DATA TYPE VARCHAR(7);
ALTER TABLE "Rental" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(12,2);
ALTER TABLE "Rental" ALTER COLUMN "advancePayment" SET DATA TYPE DECIMAL(12,2);

-- AlterTable: Add length constraints and change types for Payment
ALTER TABLE "Payment" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2);
ALTER TABLE "Payment" ALTER COLUMN "notes" SET DATA TYPE VARCHAR(100);

-- AlterTable: Add length constraints and change types for Settings
ALTER TABLE "Settings" ALTER COLUMN "businessName" SET DATA TYPE VARCHAR(100);
ALTER TABLE "Settings" ALTER COLUMN "currency" SET DATA TYPE VARCHAR(3);
ALTER TABLE "Settings" ALTER COLUMN "currencySymbol" SET DATA TYPE VARCHAR(5);
ALTER TABLE "Settings" ALTER COLUMN "businessPhone" SET DATA TYPE VARCHAR(15);
ALTER TABLE "Settings" ALTER COLUMN "businessEmail" SET DATA TYPE VARCHAR(254);
ALTER TABLE "Settings" ALTER COLUMN "businessAddress" SET DATA TYPE VARCHAR(100);
ALTER TABLE "Settings" ALTER COLUMN "taxRate" SET DATA TYPE DECIMAL(5,2);
ALTER TABLE "Settings" ALTER COLUMN "dateFormat" SET DATA TYPE VARCHAR(20);
ALTER TABLE "Settings" ALTER COLUMN "timezone" SET DATA TYPE VARCHAR(64);

-- Add UNIQUE constraint for item name (case-insensitive)
-- First, normalize existing data to Title Case to prevent conflicts
UPDATE "Item" SET "name" = INITCAP(TRIM("name"));

-- Create case-insensitive unique index
CREATE UNIQUE INDEX "unique_item_name" ON "Item" (LOWER("name"));

-- Add UNIQUE constraint for customer email (allowing multiple NULLs)
-- First, normalize existing emails to lowercase
UPDATE "Customer" SET "email" = LOWER(TRIM("email")) WHERE "email" IS NOT NULL;

-- Create unique index that allows multiple NULLs
CREATE UNIQUE INDEX "unique_customer_email" ON "Customer" ("email") WHERE "email" IS NOT NULL;

-- Add UNIQUE constraint for booking reference (allowing multiple NULLs)
CREATE UNIQUE INDEX "unique_booking_reference" ON "Rental" ("reference") WHERE "reference" IS NOT NULL;

-- Add CHECK constraints for data integrity
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_quantity_nonneg" CHECK ("totalQuantity" >= 0);
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_quantity_max" CHECK ("totalQuantity" <= 100000);
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_price_nonneg" CHECK ("price" IS NULL OR "price" >= 0);
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_price_max" CHECK ("price" IS NULL OR "price" <= 1000000.00);

ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_dates" CHECK ("endDate" >= "startDate");
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_total_price" CHECK ("totalPrice" IS NULL OR "totalPrice" >= 0);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_total_price_max" CHECK ("totalPrice" IS NULL OR "totalPrice" <= 10000000.00);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_advance" CHECK ("advancePayment" IS NULL OR "advancePayment" >= 0);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_advance_max" CHECK ("advancePayment" IS NULL OR "advancePayment" <= 10000000.00);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_advance_le_total" CHECK ("advancePayment" IS NULL OR "totalPrice" IS NULL OR "advancePayment" <= "totalPrice");

ALTER TABLE "RentalItem" ADD CONSTRAINT "chk_booking_item_quantity" CHECK ("quantity" >= 1);
ALTER TABLE "RentalItem" ADD CONSTRAINT "chk_booking_item_quantity_max" CHECK ("quantity" <= 100000);

ALTER TABLE "Payment" ADD CONSTRAINT "chk_payment_amount_pos" CHECK ("amount" > 0);
ALTER TABLE "Payment" ADD CONSTRAINT "chk_payment_amount_max" CHECK ("amount" <= 10000000.00);

ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_tax_rate" CHECK ("taxRate" IS NULL OR ("taxRate" >= 0 AND "taxRate" <= 100.00));
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_low_stock" CHECK ("lowStockThreshold" >= 0);
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_low_stock_max" CHECK ("lowStockThreshold" <= 100000);
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_rental_days" CHECK ("defaultRentalDays" >= 1);
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_rental_days_max" CHECK ("defaultRentalDays" <= 365);
