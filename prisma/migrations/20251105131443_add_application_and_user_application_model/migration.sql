-- CreateTable
CREATE TABLE "Application" (
    "application_id" TEXT NOT NULL,
    "package_name" TEXT NOT NULL,
    "app_name" TEXT NOT NULL,
    "icon_path" TEXT,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "user_application" (
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,

    CONSTRAINT "user_application_pkey" PRIMARY KEY ("user_id","application_id")
);

-- AddForeignKey
ALTER TABLE "user_application" ADD CONSTRAINT "user_application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_application" ADD CONSTRAINT "user_application_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("application_id") ON DELETE CASCADE ON UPDATE CASCADE;
