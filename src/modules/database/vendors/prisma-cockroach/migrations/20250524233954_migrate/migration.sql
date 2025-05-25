-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('ACTIVE', 'DISABLED', 'HIDDEN');

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "active" BOOL NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idProject" UUID,
    "token" STRING NOT NULL DEFAULT md5(random()::text),

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idProject" UUID,
    "title" STRING NOT NULL,
    "description" STRING,
    "featuredImageURL" STRING,
    "date" INT8 NOT NULL,
    "blocks" JSONB NOT NULL,
    "meta" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "status" "PostStatus" NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "mimeType" STRING NOT NULL,
    "extension" STRING NOT NULL,
    "date" INT8 NOT NULL,
    "sizeKb" INT4 NOT NULL,
    "meta" JSONB NOT NULL,
    "data64" STRING NOT NULL,
    "hasThumbnail" BOOL NOT NULL,
    "thumbnail64" STRING,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToProject" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PostToProject_AB_unique" ON "_PostToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToProject_B_index" ON "_PostToProject"("B");

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToProject" ADD CONSTRAINT "_PostToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToProject" ADD CONSTRAINT "_PostToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
