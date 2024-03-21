-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- CreateTable
CREATE TABLE "Blob" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "date" INT8 NOT NULL,
    "fileMimeType" STRING NOT NULL,
    "fileExtension" STRING NOT NULL,
    "data64" STRING NOT NULL,
    "thumbnail64" STRING,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);
