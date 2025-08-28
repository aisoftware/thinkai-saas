/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagTenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TagTenant" DROP CONSTRAINT "TagTenant_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagTenant" DROP CONSTRAINT "TagTenant_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TagUser" DROP CONSTRAINT "TagUser_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TagUser" DROP CONSTRAINT "TagUser_userId_fkey";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TagTenant";

-- DropTable
DROP TABLE "TagUser";
