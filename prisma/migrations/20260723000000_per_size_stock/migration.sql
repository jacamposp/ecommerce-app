-- Add per-size stock columns to Product
ALTER TABLE "Product" ADD COLUMN "stockS" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "stockM" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "stockL" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN "stockXL" INTEGER NOT NULL DEFAULT 0;

-- Backfill: distribute the existing single stock across sizes
-- (even split, remainder assigned to M) so no inventory is lost.
UPDATE "Product" SET
  "stockS" = "stock" / 4,
  "stockL" = "stock" / 4,
  "stockXL" = "stock" / 4,
  "stockM" = "stock" - 3 * ("stock" / 4);

-- Drop the old single stock column
ALTER TABLE "Product" DROP COLUMN "stock";

-- Add size to OrderItem. Backfill historical rows to 'M' (arbitrary, since
-- the size was never recorded), then require it going forward.
ALTER TABLE "OrderItem" ADD COLUMN "size" TEXT NOT NULL DEFAULT 'M';
ALTER TABLE "OrderItem" ALTER COLUMN "size" DROP DEFAULT;
