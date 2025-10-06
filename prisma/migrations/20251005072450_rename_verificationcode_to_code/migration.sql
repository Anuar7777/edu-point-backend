/*
  Warnings:

  - You are about to drop the `verification_code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."verification_code" DROP CONSTRAINT "verification_code_user_id_fkey";

-- DropTable
DROP TABLE "public"."verification_code";

-- CreateTable
CREATE TABLE "code" (
    "code_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "type" "CodeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "code_pkey" PRIMARY KEY ("code_id")
);

-- AddForeignKey
ALTER TABLE "code" ADD CONSTRAINT "code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
