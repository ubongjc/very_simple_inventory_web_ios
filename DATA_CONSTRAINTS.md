# Data Constraints and Validation Rules

This document outlines all data constraints, validation rules, and limits enforced in the VSI (Visual Services Inventory) application.

## Overview

All data constraints are enforced at **three layers**:

1. **Database Layer**: Column types, lengths, CHECK constraints, and UNIQUE indexes (PostgreSQL)
2. **API Layer**: Zod validation schemas that validate and normalize data
3. **Form Layer**: Client-side validation with React Hook Form + Zod

## Data Normalization

Before validation, all data is normalized using the following rules:

- **Text fields**: Trimmed, multiple spaces collapsed to single space
- **Item names**: Converted to Title Case (e.g., "chair blue" → "Chair Blue")
- **Customer names**: Converted to Title Case (e.g., "john o'brien" → "John O'Brien")
- **Emails**: Converted to lowercase
- **Phone numbers**: Formatted to E.164 (digits only with optional + prefix)
- **Units**: Converted to lowercase
- **Money values**: Rounded to 2 decimal places

## Entity Constraints

### Items

| Field | Type | Required | Min | Max | Format/Rules | Unique |
|-------|------|----------|-----|-----|--------------|--------|
| **name** | String | ✅ Yes | 2 chars | 80 chars | Letters, numbers, spaces, ()-/.& allowed. Auto Title Case. | ✅ Case-insensitive |
| **unit** | String | ✅ Yes | 2 chars | 16 chars | Letters and spaces only (lowercase). | ❌ |
| **totalQuantity** | Integer | ✅ Yes | 0 | 100,000 | Whole number | ❌ |
| **price** | Decimal(12,2) | ❌ No | 0.00 | 1,000,000.00 | Max 2 decimal places | ❌ |
| **notes** | String | ❌ No | 0 | 50 chars | Any printable text | ❌ |

**Business Rules**:
- Item names are case-insensitive unique (e.g., "Chair" and "chair" cannot both exist)
- Item names are automatically converted to Title Case
- Unit is always stored in lowercase

---

### Customers

| Field | Type | Required | Min | Max | Format/Rules | Unique |
|-------|------|----------|-----|-----|--------------|--------|
| **firstName** | String | ✅ Yes | 1 char | 50 chars | Letters, spaces, hyphens, apostrophes. Auto Title Case. | ❌ |
| **lastName** | String | ❌ No | 0 | 50 chars | Letters, spaces, hyphens, apostrophes. Auto Title Case. | ❌ |
| **phone** | String | ❌ No | 8 chars | 15 chars | E.164 format: `^\+?[1-9]\d{7,14}$` | ❌ |
| **email** | String | ❌ No | 3 chars | 254 chars | Valid email (RFC5322). Auto lowercase. | ✅ (if provided) |
| **address** | String | ❌ No | 0 | 200 chars | Common address characters | ❌ |
| **notes** | String | ❌ No | 0 | 50 chars | Any printable text | ❌ |

**Business Rules**:
- Email must be unique across all customers (if provided; blank emails are allowed)
- Customer names are automatically converted to Title Case
- Phone numbers are normalized to E.164 format (+ followed by digits)
- Duplicate customers with same firstName + lastName combination are rejected

---

### Bookings (Rentals)

| Field | Type | Required | Min | Max | Format/Rules | Unique |
|-------|------|----------|-----|-----|--------------|--------|
| **customerId** | String (CUID) | ✅ Yes | - | - | Valid CUID, must reference existing customer | ❌ |
| **startDate** | DateTime | ✅ Yes | 2000-01-01 | Today + 365 days | Stored as UTC midnight. YYYY-MM-DD format. | ❌ |
| **endDate** | DateTime | ✅ Yes | 2000-01-01 | Today + 366 days | Stored as UTC midnight. Must be ≥ startDate. | ❌ |
| **status** | Enum | ❌ No | - | - | CONFIRMED, OUT, RETURNED, CANCELLED (default: CONFIRMED) | ❌ |
| **reference** | String | ❌ No | 10 chars | 10 chars | Format: `BKG-000000` (regex: `^BKG-\d{6}$`) | ✅ (if provided) |
| **notes** | String | ❌ No | 0 | 50 chars | Any printable text | ❌ |
| **color** | String | ❌ No | 4 chars | 7 chars | Hex color: `#RGB` or `#RRGGBB` | ❌ |
| **totalPrice** | Decimal(12,2) | ❌ No | 0.00 | 10,000,000.00 | Max 2 decimal places | ❌ |
| **advancePayment** | Decimal(12,2) | ❌ No | 0.00 | 10,000,000.00 | Max 2 decimal places. Must be ≤ totalPrice. | ❌ |
| **paymentDueDate** | DateTime | ❌ No | 2000-01-01 | Today + 366 days | Stored as UTC midnight. Should be ≥ startDate. | ❌ |

**Business Rules**:
- Booking reference format is `BKG-XXXXXX` (6 digits)
- Booking reference must be unique if provided
- endDate must be greater than or equal to startDate
- advancePayment cannot exceed totalPrice
- Total of all payments (advance + additional) cannot exceed totalPrice
- Only CONFIRMED and OUT status count toward item availability
- Calendar displays use exclusive end date (endDate + 1 day for FullCalendar)

---

### Booking Items (Rental Items)

| Field | Type | Required | Min | Max | Format/Rules | Unique |
|-------|------|----------|-----|-----|--------------|--------|
| **itemId** | String (CUID) | ✅ Yes | - | - | Valid CUID, must reference existing item | ❌ |
| **quantity** | Integer | ✅ Yes | 1 | 100,000 | Whole number | ❌ |

**Business Rules**:
- Each booking must have at least 1 item
- Duplicate items within a booking are prevented (unique constraint on bookingId + itemId)
- Quantity must not exceed item's totalQuantity
- **Availability Checking**: Per-day capacity validation
  - For each day in the booking range [startDate..endDate]:
    - `reserved(day, item) = SUM(quantity for rentals with status IN (CONFIRMED, OUT))`
    - Require: `reserved + requested ≤ item.totalQuantity`

---

### Payments

| Field | Type | Required | Min | Max | Format/Rules | Unique |
|-------|------|----------|-----|-----|--------------|--------|
| **amount** | Decimal(12,2) | ✅ Yes | 0.01 | 10,000,000.00 | Max 2 decimal places. Must be > 0. | ❌ |
| **paymentDate** | DateTime | ✅ Yes | 2000-01-01 | Today | Stored as UTC midnight. Cannot be in future. | ❌ |
| **notes** | String | ❌ No | 0 | 100 chars | Any printable text | ❌ |

**Business Rules**:
- Payment amount must be greater than 0
- Payment amount cannot exceed remaining balance on the booking
- Payment date can be before booking startDate (prepayments allowed)
- Payment date cannot be in the future

---

### Settings

| Field | Type | Required | Min | Max | Format/Rules | Unique |
|-------|------|----------|-----|-----|--------------|--------|
| **businessName** | String | ✅ Yes | 2 chars | 100 chars | Letters, numbers, spaces, &/-. allowed | ❌ |
| **currency** | String | ✅ Yes | 3 chars | 3 chars | ISO 4217 code (e.g., USD, EUR, NGN). Uppercase. | ❌ |
| **currencySymbol** | String | ✅ Yes | 1 char | 5 chars | Currency symbol (e.g., $, €, ₦) | ❌ |
| **businessPhone** | String | ❌ No | 8 chars | 15 chars | E.164 format: `^\+?[1-9]\d{7,14}$` | ❌ |
| **businessEmail** | String | ❌ No | 3 chars | 254 chars | Valid email (RFC5322). Auto lowercase. | ❌ |
| **businessAddress** | String | ❌ No | 0 | 100 chars | Common address characters | ❌ |
| **taxRate** | Decimal(5,2) | ❌ No | 0.00 | 100.00 | Percentage (e.g., 10.00 for 10%). Max 2 decimals. | ❌ |
| **lowStockThreshold** | Integer | ✅ Yes | 0 | 100,000 | Whole number. Default: 5 | ❌ |
| **defaultRentalDays** | Integer | ✅ Yes | 1 | 365 | Whole number. Default: 1 | ❌ |
| **dateFormat** | String | ✅ Yes | - | - | Enum: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, MMM DD YYYY | ❌ |
| **timezone** | String | ✅ Yes | 1 char | 64 chars | IANA timezone (e.g., UTC, Africa/Lagos, America/Toronto) | ❌ |

**Business Rules**:
- Only one Settings record exists in the database (singleton pattern)
- Currency must be a valid ISO 4217 3-letter code
- Tax rate is optional but must be between 0-100% if provided

---

## Database Constraints (PostgreSQL)

### CHECK Constraints

```sql
-- Items
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_quantity_nonneg" CHECK ("totalQuantity" >= 0);
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_quantity_max" CHECK ("totalQuantity" <= 100000);
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_price_nonneg" CHECK ("price" IS NULL OR "price" >= 0);
ALTER TABLE "Item" ADD CONSTRAINT "chk_item_price_max" CHECK ("price" IS NULL OR "price" <= 1000000.00);

-- Bookings (Rental table)
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_dates" CHECK ("endDate" >= "startDate");
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_total_price" CHECK ("totalPrice" IS NULL OR "totalPrice" >= 0);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_total_price_max" CHECK ("totalPrice" IS NULL OR "totalPrice" <= 10000000.00);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_advance" CHECK ("advancePayment" IS NULL OR "advancePayment" >= 0);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_advance_max" CHECK ("advancePayment" IS NULL OR "advancePayment" <= 10000000.00);
ALTER TABLE "Rental" ADD CONSTRAINT "chk_booking_advance_le_total" CHECK ("advancePayment" IS NULL OR "totalPrice" IS NULL OR "advancePayment" <= "totalPrice");

-- Booking Items (RentalItem table)
ALTER TABLE "RentalItem" ADD CONSTRAINT "chk_booking_item_quantity" CHECK ("quantity" >= 1);
ALTER TABLE "RentalItem" ADD CONSTRAINT "chk_booking_item_quantity_max" CHECK ("quantity" <= 100000);

-- Payments
ALTER TABLE "Payment" ADD CONSTRAINT "chk_payment_amount_pos" CHECK ("amount" > 0);
ALTER TABLE "Payment" ADD CONSTRAINT "chk_payment_amount_max" CHECK ("amount" <= 10000000.00);

-- Settings
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_tax_rate" CHECK ("taxRate" IS NULL OR ("taxRate" >= 0 AND "taxRate" <= 100.00));
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_low_stock" CHECK ("lowStockThreshold" >= 0);
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_low_stock_max" CHECK ("lowStockThreshold" <= 100000);
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_rental_days" CHECK ("defaultRentalDays" >= 1);
ALTER TABLE "Settings" ADD CONSTRAINT "chk_settings_rental_days_max" CHECK ("defaultRentalDays" <= 365);
```

### UNIQUE Constraints

```sql
-- Item name (case-insensitive)
CREATE UNIQUE INDEX "unique_item_name" ON "Item" (LOWER("name"));

-- Customer email (case-insensitive, allows multiple NULLs)
CREATE UNIQUE INDEX "unique_customer_email" ON "Customer" ("email") WHERE "email" IS NOT NULL;

-- Booking reference (allows multiple NULLs)
CREATE UNIQUE INDEX "unique_booking_reference" ON "Rental" ("reference") WHERE "reference" IS NOT NULL;

-- Booking items (prevent duplicate items in a booking)
ALTER TABLE "RentalItem" ADD CONSTRAINT "RentalItem_rentalId_itemId_key" UNIQUE ("rentalId", "itemId");
```

---

## Validation Schemas

All validation schemas are defined in `app/lib/validation.ts` using Zod.

### Key Validation Features:

1. **Data Transformation**: Automatic normalization (trim, title case, lowercase, etc.)
2. **Type Coercion**: String inputs converted to appropriate types (numbers, dates, etc.)
3. **Custom Regex Patterns**: Phone numbers, emails, hex colors, booking references
4. **Refinements**: Cross-field validation (e.g., advancePayment ≤ totalPrice)

---

## Common Patterns

### E.164 Phone Number Format

```regex
^\+?[1-9]\d{7,14}$
```

- Optional `+` prefix
- Must start with digit 1-9
- Total of 8-15 digits
- Examples: `+12345678901`, `2345678901`

### Hex Color Format

```regex
^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$
```

- Must start with `#`
- Either 3 or 6 hex digits
- Examples: `#F00`, `#3b82f6`

### Booking Reference Format

```regex
^BKG-\d{6}$
```

- Format: `BKG-` followed by exactly 6 digits
- Example: `BKG-000123`

---

## Error Handling

### Client-Side (Forms)

- **Immediate feedback**: Validation errors shown on blur or submit
- **Character counters**: Displayed for fields with length limits (notes, addresses)
- **Type-specific inputs**: Number inputs for quantities, date pickers for dates
- **Descriptive errors**: Clear messages explaining what's wrong and how to fix it

### Server-Side (API)

- **409 Conflict**: Duplicate item names, customer emails, or booking references
- **400 Bad Request**: Validation errors (Zod schema violations)
- **404 Not Found**: Referenced entity doesn't exist (customerId, itemId)
- **500 Internal Server Error**: Database or server issues

---

## Migration Notes

When applying the data constraints migration:

1. **Existing item names** are normalized to Title Case
2. **Existing emails** are normalized to lowercase
3. **Float to Decimal conversion** is automatic (PostgreSQL handles precision)
4. **CHECK constraints** will reject any existing data that violates limits
5. **UNIQUE indexes** will fail if duplicate data exists

### Pre-Migration Checklist

- [ ] Backup database
- [ ] Check for duplicate item names (case-insensitive)
- [ ] Check for duplicate customer emails
- [ ] Verify all quantities are within 0-100,000 range
- [ ] Verify all prices/amounts are within limits
- [ ] Check for any invalid phone numbers or emails

---

## Future Considerations

### Potential Enhancements

1. **Unit Enum**: Consider converting `unit` field to a strict enum (pcs, sets, boxes, etc.)
2. **Auto-Reference Generation**: Implement auto-incrementing BKG reference numbers
3. **Phone Formatting**: Add country-specific phone formatting for display
4. **Soft Deletes**: Add `deletedAt` timestamp instead of hard deletes
5. **Audit Trail**: Track who created/modified records and when

### Performance Optimizations

1. **Indexed Fields**: All foreign keys and frequently queried fields are indexed
2. **Partial Indexes**: UNIQUE indexes on nullable fields use `WHERE ... IS NOT NULL`
3. **NUMERIC vs FLOAT**: Using NUMERIC(12,2) ensures precision for financial data

---

## Contact & Support

For questions about data constraints or validation:
- Review this document
- Check `app/lib/validation.ts` for Zod schemas
- Check `prisma/schema.prisma` for database types
- Review migration file in `prisma/migrations/20251112220400_add_data_constraints_and_limits/`
