/*
  Warnings:

  - You are about to drop the column `text_en` on the `question_template` table. All the data in the column will be lost.
  - You are about to drop the column `text_kz` on the `question_template` table. All the data in the column will be lost.
  - You are about to drop the column `text_ru` on the `question_template` table. All the data in the column will be lost.
  - Added the required column `text` to the `question_template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_template" DROP COLUMN "text_en",
DROP COLUMN "text_kz",
DROP COLUMN "text_ru",
ADD COLUMN     "text" TEXT NOT NULL;
