/*
  Warnings:

  - You are about to drop the `history` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('PASSED', 'FAILED', 'PENDING');

-- DropForeignKey
ALTER TABLE "public"."history" DROP CONSTRAINT "history_section_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."history" DROP CONSTRAINT "history_userId_fkey";

-- DropTable
DROP TABLE "public"."history";

-- DropEnum
DROP TYPE "public"."HistoryStatus";

-- CreateTable
CREATE TABLE "test" (
    "test_id" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "results" JSONB,
    "status" "TestStatus" NOT NULL,
    "section_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("test_id")
);

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
