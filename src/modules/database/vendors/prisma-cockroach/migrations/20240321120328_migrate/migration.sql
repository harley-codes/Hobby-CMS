/*
  Warnings:

  - Added the required column `hasThumbnail` to the `DataFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- AlterTable
ALTER TABLE "DataFile" ADD COLUMN     "hasThumbnail" BOOL NOT NULL;
