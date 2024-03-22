/*
  Warnings:

  - You are about to drop the `DataFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- DropTable
DROP TABLE "DataFile";

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "mimeType" STRING NOT NULL,
    "extension" STRING NOT NULL,
    "date" INT4 NOT NULL,
    "sizeKb" INT4 NOT NULL,
    "meta" JSONB NOT NULL,
    "data64" STRING NOT NULL,
    "hasThumbnail" BOOL NOT NULL,
    "thumbnail64" STRING,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
