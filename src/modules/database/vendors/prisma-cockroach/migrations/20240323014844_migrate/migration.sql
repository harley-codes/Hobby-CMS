/*
  Warnings:

  - Changed the type of `date` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `date` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- AlterTable
ALTER TABLE "File" DROP COLUMN "date";
ALTER TABLE "File" ADD COLUMN     "date" INT8 NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "date";
ALTER TABLE "Post" ADD COLUMN     "date" INT8 NOT NULL;
