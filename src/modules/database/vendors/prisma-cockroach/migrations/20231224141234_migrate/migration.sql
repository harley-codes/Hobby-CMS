/*
  Warnings:

  - Added the required column `meta` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "meta" JSONB NOT NULL;
