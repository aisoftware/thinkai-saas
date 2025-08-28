import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { sendEmailPostmark } from "./PostmarkEmailService";
import { sendEmailResend } from "./ResendEmailService";
import { sendEmailSendGrid } from "./SendGridEmailService";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export async function sendEmail({
  request,
  to,
  subject,
  body,
  alias,
  data,
  manualConfig,
}: {
  request: Request;
  to: string;
  subject: string;
  body: string;
  alias?: string;
  data?: {
    [key: string]: any;
  };
  manualConfig?: {
    provider: "postmark" | "resend" | "sendgrid";
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
}) {
  const config = manualConfig ?? (await getEmailConfig({ request, throwError: true }));
  if (!config) {
    // eslint-disable-next-line no-console
    throw new Error("📧 Email provider not configured");
  }
  // eslint-disable-next-line no-console
  console.log("📧 Sending email", { providerSettings: config.provider, to, subject, data });
  switch (config.provider) {
    case "postmark":
      return await sendEmailPostmark({ request, data: { to, subject, body, alias, data }, config });
    case "resend":
      invariant(subject, "Subject is required");
      invariant(body, "Body is required");
      return await sendEmailResend({ request, data: { to, subject, body }, config });
    case "sendgrid":
      invariant(subject, "Subject is required");
      invariant(body, "Body is required");
      return await sendEmailSendGrid({ request, data: { to, subject, body }, config });
    default:
      throw new Error("Invalid provider: " + config.provider);
  }
}

export async function getEmailProvider({ request }: { request: Request }) {
  const clientConfig = await getEmailConfig({ request });
  return clientConfig?.provider;
}

export async function getEmailConfig({ request, throwError = false }: { request: Request; throwError?: boolean }) {
  const appConfiguration = await getAppConfiguration({ request });
  const apiKeyCredential = await db.credential.findUnique({
    where: {
      name: appConfiguration.email.provider,
    },
  });
  let provider = appConfiguration.email.provider;
  let apiKey = apiKeyCredential?.value?.toString();
  if (provider === "postmark") {
    if (!apiKey) {
      apiKey = process.env.POSTMARK_SERVER_TOKEN;
    }
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error("📧 POSTMARK_SERVER_TOKEN required");
      if (throwError) {
        throw new Error("POSTMARK_SERVER_TOKEN required");
      }
      return null;
    }
    return {
      apiKey,
      ...appConfiguration.email,
    };
  } else if (provider === "resend") {
    if (!apiKey) {
      apiKey = process.env.RESEND_API_KEY;
    }
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error("📧 RESEND_API_KEY required");
      if (throwError) {
        throw new Error("RESEND_API_KEY required");
      }
      return null;
    }
    return {
      apiKey,
      ...appConfiguration.email,
    };
  } else if (provider === "sendgrid") {
    if (!apiKey) {
      apiKey = process.env.SENDGRID_API_KEY;
    }
    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error("📧 SENDGRID_API_KEY required");
      if (throwError) {
        throw new Error("SENDGRID_API_KEY required");
      }
      return null;
    }
    return {
      apiKey,
      ...appConfiguration.email,
    };
  }
  console.error("📧 POSTMARK_SERVER_TOKEN, RESEND_API_KEY or SENDGRID_API_KEY required");
  return null;
}
