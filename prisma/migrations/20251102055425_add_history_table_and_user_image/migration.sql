-- CreateEnum
CREATE TYPE "HistoryStatus" AS ENUM ('PASSED', 'FAILED', 'PENDING');

-- DropForeignKey
ALTER TABLE "public"."settings" DROP CONSTRAINT "settings_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "history" (
    "history_id" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "status" "HistoryStatus" NOT NULL,
    "section_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("history_id")
);

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
