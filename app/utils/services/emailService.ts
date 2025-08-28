import { EmailTemplate } from "~/application/dtos/email/EmailTemplate";
import emailTemplates from "~/application/emails/emailTemplates.server";
import { db } from "../db.server";
import { createPostmarkTemplate, deletePostmarkTemplate, getPostmarkTemplates } from "../postmark.server";
import { getTenant } from "../db/tenants.db.server";
import { getAvailableTenantSlug } from "./tenantService";

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  const items: EmailTemplate[] = [];
  try {
    const items = await emailTemplates();
    const templates = await getPostmarkTemplates();

    items.forEach((item) => {
      const template = templates.find((f) => f.alias === item.alias);
      if (template) {
        item.associatedServerId = template.associatedServerId;
        item.active = template.active;
        item.templateId = template.templateId;
      }
    });
    return items;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[ERROR at getEmailTemplates]: " + e);
  }
  return items;
}

export async function createPostmarkEmailTemplates(alias?: string) {
  let templatesCreated = 0;
  const templates = await emailTemplates();
  const layoutTemplate = templates.find((f) => f.type === "layout");
  if (layoutTemplate && layoutTemplate.associatedServerId <= 0) {
    await createPostmarkTemplate(layoutTemplate)
      .then(() => {
        templatesCreated++;
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(`[Error] ${layoutTemplate.alias}: ${e}`);
      });
  }
  if (alias) {
    const template = templates.find((f) => f.alias === alias);
    if (template) {
      await createPostmarkTemplate(template, layoutTemplate?.alias)
        .then(() => {
          templatesCreated++;
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(`[Error] ${template.alias}: ${e}`);
        });
      await new Promise((res) => setTimeout(res, 100));
    }
  } else {
    return await Promise.all(
      templates
        .filter((f) => f.type === "standard")
        .map(async (item) => {
          await createPostmarkTemplate(item, layoutTemplate?.alias)
            .then(() => {
              templatesCreated++;
            })
            .catch((e) => {
              // eslint-disable-next-line no-console
              console.error(`[Error] ${item.alias}: ${e}`);
            });
          await new Promise((res) => setTimeout(res, 1));
        })
    );
  }
  console.log({ templatesCreated });
  if (templatesCreated > 0) {
    // eslint-disable-next-line no-console
    console.log(`Created ${templatesCreated} email templates`);
  } else {
    throw new Error("No email templates created");
  }
}

export async function deleteEmailTemplate(alias: string) {
  return await deletePostmarkTemplate(alias);
}

export async function getAvailableTenantInboundAddress(name: string) {
  const slug = await getAvailableTenantSlug({ name });
  const slugWithDots = slug.split("-").join(".");
  let address = slugWithDots;
  let tries = 1;
  do {
    const existingAddress = await db.tenantInboundAddress.findUnique({
      where: {
        address,
      },
    });
    if (existingAddress !== null) {
      address = slugWithDots + tries.toString();
      tries++;
    } else {
      break;
    }
  } while (true);
  return address;
}

export async function getTenantDefaultInboundAddress(tenantId: string) {
  const tenant = await getTenant(tenantId);
  let address: string | null = null;
  if (tenant?.inboundAddresses && tenant?.inboundAddresses.length > 0) {
    address = tenant.inboundAddresses[0].address;
  }
  return address;
}
