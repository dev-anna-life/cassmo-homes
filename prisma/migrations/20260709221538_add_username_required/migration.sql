-- AlterTable: add username column (nullable first so we can fill in defaults)
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Set default usernames for any existing users that don't have one
-- Use their name converted to lowercase with spaces replaced by underscores
UPDATE "User"
SET "username" = LOWER(REGEXP_REPLACE("name", '\s+', '_', 'g'))
WHERE "username" IS NULL;

-- Make username unique and not null
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");

-- Note: PostgreSQL doesn't allow ALTER COLUMN to set NOT NULL if there are nulls,
-- so we handle this by setting defaults first, then applying the NOT NULL constraint.
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
