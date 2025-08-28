-- AlterTable
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "AppConfiguration" ADD COLUMN     "emailFromEmail" TEXT,
ADD COLUMN     "emailFromName" TEXT,
ADD COLUMN     "emailProvider" TEXT,
ADD COLUMN     "emailSupportEmail" TEXT;

-- AlterTable
ALTER TABLE "TenantSettingsRow" ADD CONSTRAINT "TenantSettingsRow_pkey" PRIMARY KEY ("tenantId");
