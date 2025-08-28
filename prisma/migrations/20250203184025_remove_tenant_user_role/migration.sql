/*
  Warnings:

  - You are about to drop the `TenantUserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TenantUserRole" DROP CONSTRAINT "TenantUserRole_tenantUserId_fkey";

-- DropTable
DROP TABLE "TenantUserRole";
