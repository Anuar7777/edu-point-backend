-- CreateEnum
CREATE TYPE "CodeType" AS ENUM ('email', 'phone', 'password_reset', 'invite');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('parent', 'child');

-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "daily_limit" INTEGER,
    "bonus_time" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "family" (
    "family_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "family_pkey" PRIMARY KEY ("family_id")
);

-- CreateTable
CREATE TABLE "family_member" (
    "family_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "family_member_pkey" PRIMARY KEY ("family_id","user_id")
);

-- CreateTable
CREATE TABLE "verification_code" (
    "code_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "type" "CodeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "verification_code_pkey" PRIMARY KEY ("code_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "family"("family_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_member" ADD CONSTRAINT "family_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_code" ADD CONSTRAINT "verification_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
