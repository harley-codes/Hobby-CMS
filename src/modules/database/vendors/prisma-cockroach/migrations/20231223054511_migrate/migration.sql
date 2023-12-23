-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('ACTIVE', 'DISABLED', 'HIDDEN');

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" STRING NOT NULL,
    "active" BOOL NOT NULL,

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
    "name" STRING NOT NULL,
    "description" STRING,
    "featuredImageURL" STRING,
    "date" INT8 NOT NULL,
    "blocks" JSONB NOT NULL,
    "meta" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "status" "PostStatus" NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
