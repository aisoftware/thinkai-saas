/*
  Warnings:

  - You are about to drop the `AppCookie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Module` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Entity" DROP CONSTRAINT "Entity_moduleId_fkey";

-- AlterTable
ALTER TABLE "_PermissionToTenantTypeRelationship" ADD CONSTRAINT "_PermissionToTenantTypeRelationship_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PermissionToTenantTypeRelationship_AB_unique";

-- AlterTable
ALTER TABLE "_SubscriptionProductToTenantType" ADD CONSTRAINT "_SubscriptionProductToTenantType_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_SubscriptionProductToTenantType_AB_unique";

-- AlterTable
ALTER TABLE "_TenantToTenantType" ADD CONSTRAINT "_TenantToTenantType_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_TenantToTenantType_AB_unique";

-- DropTable
DROP TABLE "AppCookie";

-- DropTable
DROP TABLE "Module";
