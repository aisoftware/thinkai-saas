import { Resend } from "resend";

export async function sendEmailResend({
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
  const resend = new Resend(config.apiKey);
  const sent = await resend.emails
    .send({
      from: config.fromEmail,
      to: [data.to],
      subject: data.subject,
      html: data.body,
    })
    .then((response) => {
      if (response.error) {
        console.log(response.error.message);
        throw response.error.message;
      }
      return response;
    })
    .catch((e) => {
      console.log("[Resend] Error sending email", e);
      throw new Error(e);
    });
  return sent;
}
