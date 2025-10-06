-- DropForeignKey
ALTER TABLE "public"."family_member" DROP CONSTRAINT "family_member_family_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."family_member" DROP CONSTRAINT "family_member_user_id_fkey";

-- AddForeignKey
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "family"("family_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
