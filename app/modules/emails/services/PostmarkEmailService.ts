import postmark from "postmark";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { getBaseURL } from "~/utils/url.server";

export async function sendEmailPostmark({
  request,
  data,
  config,
}: {
  request: Request;
  data: {
    to: string;
    subject?: string;
    body?: string;
    alias?: string;
    Attachments?: { Name: string; Content: string; ContentType: string; ContentID: string }[];
    data?: {
      [key: string]: any;
    };
  };
  config: {
    fromEmail: string;
    fromName: string;
    apiKey: string;
  };
}) {
  const client = new postmark.ServerClient(config.apiKey);
  if (data.alias) {
    const sent = await client.sendEmailWithTemplate({
      From: config.fromName ? `${config.fromName} <${config.fromEmail}>` : config.fromEmail,
      To: data.to,
      TemplateAlias: data.alias,
      TemplateModel: {
        ...(await getBaseTemplateModel(request)),
        ...data.data,
      },
      Attachments: data.Attachments || [],
    });
    return sent;
  } else {
    if (!data.subject) {
      throw new Error("Subject is required");
    }
    if (!data.body) {
      throw new Error("Body is required");
    }
    const sent = await client
      .sendEmail({
        From: config.fromEmail,
        To: data.to,
        Subject: data.subject,
        HtmlBody: data.body,
      })
      .catch((e) => {
        console.log("[Postmark] Error sending email", e.message);
        throw e;
      });
    return sent;
  }
}

async function getBaseTemplateModel(request: Request) {
  const currentTenantUrl = getBaseURL(request)?.toString();
  const appConfiguration = await getAppConfiguration({ request });
  return {
    product_url: currentTenantUrl,
    login_url: currentTenantUrl + "/login",
    product_name: appConfiguration.app.name,
    support_email: appConfiguration.email.supportEmail,
    sender_name: appConfiguration.email.fromName,
    company_name: appConfiguration.app.company?.name,
    company_address: appConfiguration.app.company?.address,
  };
}
