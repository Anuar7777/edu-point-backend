/*
  Warnings:

  - The primary key for the `Application` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `application_id` on the `Application` table. All the data in the column will be lost.
  - The primary key for the `user_application` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `application_id` on the `user_application` table. All the data in the column will be lost.
  - Added the required column `packageName` to the `user_application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."user_application" DROP CONSTRAINT "user_application_application_id_fkey";

-- AlterTable
ALTER TABLE "Application" DROP CONSTRAINT "Application_pkey",
DROP COLUMN "application_id",
ADD CONSTRAINT "Application_pkey" PRIMARY KEY ("package_name");

-- AlterTable
ALTER TABLE "user_application" DROP CONSTRAINT "user_application_pkey",
DROP COLUMN "application_id",
ADD COLUMN     "packageName" TEXT NOT NULL,
ADD CONSTRAINT "user_application_pkey" PRIMARY KEY ("user_id", "packageName");

-- AddForeignKey
ALTER TABLE "user_application" ADD CONSTRAINT "user_application_packageName_fkey" FOREIGN KEY ("packageName") REFERENCES "Application"("package_name") ON DELETE CASCADE ON UPDATE CASCADE;
