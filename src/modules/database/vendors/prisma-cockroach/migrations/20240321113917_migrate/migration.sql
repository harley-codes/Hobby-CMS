/*
  Warnings:

  - You are about to alter the column `fileSizeKb` on the `DataFile` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `date` on the `DataFile` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.
  - You are about to alter the column `date` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Int8` to `Int4`.

*/
-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- AlterTable
ALTER TABLE "DataFile" ALTER COLUMN "fileSizeKb" SET DATA TYPE INT4;
ALTER TABLE "DataFile" ALTER COLUMN "date" SET DATA TYPE INT4;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "date" SET DATA TYPE INT4;
