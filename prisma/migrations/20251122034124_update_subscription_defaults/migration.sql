-- AlterTable: Change default status from 'inactive' to 'active'
ALTER TABLE "Subscription" ALTER COLUMN "status" SET DEFAULT 'active';

-- Update existing inactive subscriptions with free plan to active (they were created during signup)
UPDATE "Subscription"
SET "status" = 'active'
WHERE "status" = 'inactive' AND "plan" = 'free';
