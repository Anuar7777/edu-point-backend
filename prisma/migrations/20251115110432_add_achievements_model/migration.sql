-- CreateTable
CREATE TABLE "achievements" (
    "achievement_name" TEXT NOT NULL,
    "achievement_icon_url" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("achievement_name")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "user_id" TEXT NOT NULL,
    "achievementName" TEXT NOT NULL,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("user_id","achievementName")
);

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementName_fkey" FOREIGN KEY ("achievementName") REFERENCES "achievements"("achievement_name") ON DELETE CASCADE ON UPDATE CASCADE;
