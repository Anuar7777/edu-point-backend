-- CreateEnum
CREATE TYPE "Language" AS ENUM ('KZ', 'RU', 'EN');

-- CreateTable
CREATE TABLE "settings" (
    "userId" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "is_app_admin" BOOLEAN NOT NULL DEFAULT false,
    "daily_limit" INTEGER NOT NULL DEFAULT 3,
    "session_time" INTEGER NOT NULL DEFAULT 60,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
