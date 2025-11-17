/*
  Warnings:

  - The primary key for the `achievements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `achievement_name` on the `achievements` table. All the data in the column will be lost.
  - You are about to drop the column `translations` on the `achievements` table. All the data in the column will be lost.
  - The primary key for the `user_achievements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `achievementName` on the `user_achievements` table. All the data in the column will be lost.
  - Added the required column `achievement_body` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - The required column `achievement_id` was added to the `achievements` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `achievementId` to the `user_achievements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."user_achievements" DROP CONSTRAINT "user_achievements_achievementName_fkey";

-- AlterTable
ALTER TABLE "achievements" DROP CONSTRAINT "achievements_pkey",
DROP COLUMN "achievement_name",
DROP COLUMN "translations",
ADD COLUMN     "achievement_body" JSONB NOT NULL,
ADD COLUMN     "achievement_id" TEXT NOT NULL,
ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("achievement_id");

-- AlterTable
ALTER TABLE "user_achievements" DROP CONSTRAINT "user_achievements_pkey",
DROP COLUMN "achievementName",
ADD COLUMN     "achievementId" TEXT NOT NULL,
ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("user_id", "achievementId");

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("achievement_id") ON DELETE CASCADE ON UPDATE CASCADE;
