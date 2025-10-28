-- AlterTable
ALTER TABLE "user" ALTER COLUMN "daily_limit" SET DEFAULT 3600;

-- CreateTable
CREATE TABLE "course" (
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "total_sections" INTEGER,

    CONSTRAINT "course_pkey" PRIMARY KEY ("course_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "tag_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "course_tag" (
    "course_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "course_tag_pkey" PRIMARY KEY ("course_id","tag_id")
);

-- CreateTable
CREATE TABLE "section" (
    "section_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,

    CONSTRAINT "section_pkey" PRIMARY KEY ("section_id")
);

-- CreateTable
CREATE TABLE "question_template" (
    "template_id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "question_template_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "question_instance" (
    "instance_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "answer_options" JSONB NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "variables" JSONB,

    CONSTRAINT "question_instance_pkey" PRIMARY KEY ("instance_id")
);

-- CreateTable
CREATE TABLE "user_course" (
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "completed_sections" INTEGER DEFAULT 0,
    "last_accessed" TIMESTAMP(3),

    CONSTRAINT "user_course_pkey" PRIMARY KEY ("user_id","course_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "course_tag" ADD CONSTRAINT "course_tag_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_tag" ADD CONSTRAINT "course_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_template" ADD CONSTRAINT "question_template_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("section_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_instance" ADD CONSTRAINT "question_instance_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "question_template"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
