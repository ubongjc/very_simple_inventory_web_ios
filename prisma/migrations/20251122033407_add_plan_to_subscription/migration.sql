-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN "plan" VARCHAR(20) NOT NULL DEFAULT 'free';

-- Update existing subscriptions to have 'free' plan
UPDATE "Subscription" SET "plan" = 'free' WHERE "plan" IS NULL;
