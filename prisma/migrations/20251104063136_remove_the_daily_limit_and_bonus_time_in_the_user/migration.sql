/*
  Warnings:

  - You are about to drop the column `bonus_time` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `daily_limit` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "bonus_time",
DROP COLUMN "daily_limit";
