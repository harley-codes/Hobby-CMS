/*
  Warnings:

  - Added the required column `allowedHost` to the `AccessToken` table without a default value. This is not possible if the table is not empty.
  - Made the column `idProject` on table `AccessToken` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AccessToken" DROP CONSTRAINT "AccessToken_idProject_fkey";

-- AlterTable
ALTER TABLE "AccessToken" ADD COLUMN     "allowedHost" STRING NOT NULL;
ALTER TABLE "AccessToken" ALTER COLUMN "idProject" SET NOT NULL;
ALTER TABLE "AccessToken" ALTER COLUMN "token" SET DEFAULT md5(random()::text);

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_idProject_fkey" FOREIGN KEY ("idProject") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
