# SaasRock Quick Start

- [Installation](#installation)
- [Deployment](#deployment)

### Installation

💿 1) Install the dependencies:

```
npm install
```

**Note**: If you encounter dependency resolution errors, use:
```
npm install --legacy-peer-deps
```

💿 2) Duplicate `.env.example` file to &rarr; `.env`.

```
cp .env.example .env
```

💿 3) Set up the minimum variables:

- **`APP_NAME`**: Your app name.
- **`SESSION_SECRET`**: A secret string.
- **`DATABASE_URL`**: This is tied to the database provider at `prisma/schema/schema.prisma` (default is **PostgreSQL**).

💿 4) Create and seed the database:

```
npx prisma migrate dev

🌱  The seed command has been executed.
```

If you get any issues, try pushing the database changes manually, and then seeding:

```
npx prisma db push
npm run seed
```

If for any reason this also fails, run the following commands for a clean install:

```
npm cache clean --force
rm -rf package-lock.json node_modules
npm cache verify
npm install
```

## Troubleshooting

### Dependency Resolution Conflicts

If you encounter `ERESOLVE` errors when running `npm install`, this is typically due to version conflicts between packages. Here are the steps to resolve them:

**Option 1: Use Legacy Peer Dependencies (Recommended)**
```bash
npm install --legacy-peer-deps
```

**Option 2: Clean Installation**
If the above doesn't work, perform a complete clean installation:

```bash
# Clear npm cache
npm cache clean --force

# Remove existing installation files
rm -rf node_modules package-lock.json

# Verify cache is clean
npm cache verify

# Install with legacy peer deps
npm install --legacy-peer-deps
```

**Common Issues:**
- **React Router version conflicts**: The project uses nightly builds of React Router packages that require compatible versions
- **React 19 compatibility**: Some packages may not yet support React 19, requiring `--legacy-peer-deps`
- **Node.js version**: The project is optimized for Node.js v20, though newer versions typically work with warnings

**Note**: Using `--legacy-peer-deps` is safe and recommended for this project due to the cutting-edge React Router v7 implementation.

**For future package installations**, always use:
```bash
npm install <package-name> --legacy-peer-deps
```

### Prisma Schema Location

This project uses a modular Prisma schema located in `prisma/schema/` directory. The configuration is handled by:
- **`prisma.config.ts`**: Modern Prisma configuration file specifying schema location
- **`package.json`**: Contains seed script configuration (legacy)

If you encounter "Could not find Prisma Schema" errors:
1. Ensure [`prisma.config.ts`](file:///Users/larrybrooks/projects/saasrock/thinkai.com/prisma.config.ts) exists and points to the correct schema directory
2. Run `npx prisma validate` to test schema detection
3. Use `npx prisma generate` to regenerate the Prisma client

---

By default, the codebase seeds the following data (see `SeedService.ts`):

- **1 Admin User**: Email is `admin@email.com` and password is `password`.
- **2 Tenants/Accounts**: _Acme Corp 1_, _Acme Corp 2_.
- **2 App Users**: _john.doe@company.com_ and _luna.davis@company.com_, both with password `password`.

**Seed production database:**

1. Create a `.env.production` file, and make sure to set the `DATABASE_URL` variable pointing to your prod database (e.g. `postgres://postgres:{PASSWORD}@db.fkfpovvbvnwgmycklghu.supabase.co:6543/postgres?pgbouncer=true`).
2. Go to `SeedService.ts` and update the default `adminUser` email and password, otherwise you will not be able to login.
3. Run `npx prisma db push` to update the database schema.
4. Run `npm run seed:prod`.
5. Undo `SeedService.ts` changes to avoid committing sensitive data.

_**DATABASE_URL vs DIRECT_URL**_: If you exhaust your database connection limit, you can use the `DIRECT_URL` env variable to connect directly to the database. Read the official [Prisma docs](https://www.prisma.io/docs/concepts/components/prisma-client/connection-management#direct-database-connection) for more info.

💿 5) Start the application:

```
npm run dev
```

Open [localhost:3000](http://localhost:3000), you'll see the landing page:

![SaasRock Landing Page Hero](https://fkfpovvbvnwgmycklghu.supabase.co/storage/v1/object/public/novel/1734724591768-quickstart-landing-page.png)

## Deployment

- [Deploy to Fly.io](/guides/deploy-fly)
- [Deploy to Vercel](/guides/deploy-vercel)
- [Deploy to AWS Lightsail](/guides/deploy-aws-lightsail)
