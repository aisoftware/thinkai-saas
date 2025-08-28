/* eslint-disable no-console */
import bcrypt from "bcryptjs";
import { TenantUserJoined } from "~/application/enums/tenants/TenantUserJoined";
import { TenantUserType } from "~/application/enums/tenants/TenantUserType";
import { TenantUserStatus } from "~/application/enums/tenants/TenantUserStatus";
import { getAvailableTenantInboundAddress } from "~/utils/services/emailService";
import { seedRolesAndPermissions } from "~/utils/services/rolesAndPermissionsService";
import { db } from "~/utils/db.server";

const adminUser = {
  email: "admin@email.com",
  password: "password",
  firstName: "Admin",
  lastName: "User",
};

async function seed() {
  if (process.env.NODE_ENV === "production") {
    if (adminUser.email === "admin@email.com" || adminUser.password === "password") {
      throw Error("You cannot seed the database with the default admin email or password in production.");
    }
  }

  const admin = await createUser({ userType: "admin", ...adminUser });

  console.log("🌱 Creating users with tenants", 2);
  const user1 = await createUser({
    userType: "app",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    password: "password",
  });
  const user2 = await createUser({
    userType: "app",
    firstName: "Luna",
    lastName: "Davis",
    email: "luna.davis@company.com",
    password: "password",
  });

  await createTenant("acme-corp-1", "Acme Corp 1", [
    { ...admin, type: TenantUserType.ADMIN },
    { ...user1, type: TenantUserType.ADMIN },
    { ...user2, type: TenantUserType.MEMBER },
  ]);
  await createTenant("acme-corp-2", "Acme Corp 2", [
    { ...user1, type: TenantUserType.OWNER },
    { ...user2, type: TenantUserType.MEMBER },
  ]);

  // Permissions
  await seedRolesAndPermissions(adminUser.email);
}

async function createUser({
  firstName,
  lastName,
  email,
  password,
  userType,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: "admin" | "app";
}) {
  if (userType === "admin") {
    console.log("🌱 Seeding admin user", email);
  } else {
    console.log("🌱 Seeding app user", email);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  let user = await db.user.findUnique({
    where: { email },
  });
  if (user) {
    const isAdmin = await db.adminUser.findUnique({ where: { userId: user.id } });
    if (!isAdmin && userType === "admin") {
      console.log(`ℹ️ User already exists, setting as admin...`, email);
      await db.adminUser.create({ data: { userId: user.id } });
    } else {
      console.log(`ℹ️ User already exists`, email);
    }
    return user;
  }
  user = await db.user.create({
    data: {
      email,
      passwordHash,
      avatar: "",
      firstName,
      lastName,
      phone: "",
    },
  });
  if (userType === "admin") {
    await db.adminUser.create({
      data: { userId: user.id },
    });
  }
  return user;
}

async function createTenant(slug: string, name: string, users: { id: string; type: TenantUserType }[]) {
  console.log("🌱 Creating tenant", `${slug}:${name}`);
  let tenant = await db.tenant.findUnique({
    where: { slug },
  });
  if (tenant) {
    console.log(`ℹ️ Tenant already exists`, slug);
    return tenant;
  }
  const address = await getAvailableTenantInboundAddress(name);
  tenant = await db.tenant.create({
    data: {
      name,
      slug,
      icon: "",
      inboundAddresses: {
        create: {
          address,
        },
      },
    },
  });

  let tenantId = tenant.id;

  await db.tenantSubscription.create({
    data: {
      tenantId,
      stripeCustomerId: "",
    },
  });

  for (const user of users) {
    const tenantUser = await db.tenantUser.findFirst({
      where: { tenantId, userId: user.id },
    });
    if (tenantUser) {
      console.log(`ℹ️ User already in tenant`, user.id, tenantId);
      continue;
    }
    await db.tenantUser.create({
      data: {
        tenantId,
        userId: user.id,
        type: user.type,
        joined: TenantUserJoined.CREATOR,
        status: TenantUserStatus.ACTIVE,
      },
    });
  }

  return tenant;
}

export default {
  seed,
};
