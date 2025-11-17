/*
  Warnings:

  - You are about to drop the `achievements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_achievements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_achievements" DROP CONSTRAINT "user_achievements_achievementId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_achievements" DROP CONSTRAINT "user_achievements_user_id_fkey";

-- DropTable
DROP TABLE "public"."achievements";

-- DropTable
DROP TABLE "public"."user_achievements";

-- CreateTable
CREATE TABLE "achievement" (
    "achievement_id" TEXT NOT NULL,
    "achievement_icon_url" TEXT,
    "achievement_body" JSONB NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "user_achievement" (
    "user_id" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,

    CONSTRAINT "user_achievement_pkey" PRIMARY KEY ("user_id","achievementId")
);

-- AddForeignKey
ALTER TABLE "user_achievement" ADD CONSTRAINT "user_achievement_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievement" ADD CONSTRAINT "user_achievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievement"("achievement_id") ON DELETE CASCADE ON UPDATE CASCADE;
