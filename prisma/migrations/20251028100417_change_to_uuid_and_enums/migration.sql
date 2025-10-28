/*
  Warnings:

  - The values [email,phone,password_reset,invite] on the enum `CodeType` will be removed. If these variants are still used in the database, this will fail.
  - The values [parent,child] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CodeType_new" AS ENUM ('EMAIL', 'PHONE', 'PASSWORD_RESET', 'INVITE');
ALTER TABLE "code" ALTER COLUMN "type" TYPE "CodeType_new" USING ("type"::text::"CodeType_new");
ALTER TYPE "CodeType" RENAME TO "CodeType_old";
ALTER TYPE "CodeType_new" RENAME TO "CodeType";
DROP TYPE "public"."CodeType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('PARENT', 'CHILD');
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;
