/*
  Warnings:

  - You are about to drop the `Blob` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- DropTable
DROP TABLE "Blob";

-- CreateTable
CREATE TABLE "DataFile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "date" INT8 NOT NULL,
    "fileMimeType" STRING NOT NULL,
    "fileExtension" STRING NOT NULL,
    "data64" STRING NOT NULL,
    "thumbnail64" STRING,
    "fileSizeKb" INT8 NOT NULL,

    CONSTRAINT "DataFile_pkey" PRIMARY KEY ("id")
);
