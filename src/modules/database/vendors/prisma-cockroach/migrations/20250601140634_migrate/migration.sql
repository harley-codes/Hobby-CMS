-- AlterTable
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);
