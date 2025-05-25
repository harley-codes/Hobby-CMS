-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "description" STRING;
ALTER TABLE "Project" ADD COLUMN     "featuredImageURL" STRING;
