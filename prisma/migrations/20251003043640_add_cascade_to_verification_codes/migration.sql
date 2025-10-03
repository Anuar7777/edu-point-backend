-- DropForeignKey
ALTER TABLE "public"."verification_code" DROP CONSTRAINT "verification_code_user_id_fkey";

-- AddForeignKey
ALTER TABLE "verification_code" ADD CONSTRAINT "verification_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
