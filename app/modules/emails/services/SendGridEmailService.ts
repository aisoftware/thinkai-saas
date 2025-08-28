import sgMail from "@sendgrid/mail";

export async function sendEmailSendGrid({
  request,
  data,
  config,
}: {
  request: Request;
  data: { to: string; subject: string; body: string };
  config: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
}) {
  console.log({ config, data });
  sgMail.setApiKey(config.apiKey);
  await sgMail
    .send({
      to: data.to,
      from: {
        name: config.fromName,
        email: config.fromEmail,
      },
      subject: data.subject,
      text: data.body,
      html: data.body,
    })
    .catch((e) => {
      let errors = [];
      if (e.response?.body?.errors && Array.isArray(e.response.body.errors)) {
        errors = e.response.body?.errors?.map((error: any) => error.message);
      }
      console.log("[SendGrid] Error sending email", errors);
      throw errors;
    });
}
