/*
  Warnings:

  - You are about to drop the column `text` on the `question_template` table. All the data in the column will be lost.
  - Added the required column `text_en` to the `question_template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_kz` to the `question_template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_ru` to the `question_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_template" DROP COLUMN "text",
ADD COLUMN     "text_en" TEXT NOT NULL,
ADD COLUMN     "text_kz" TEXT NOT NULL,
ADD COLUMN     "text_ru" TEXT NOT NULL;
