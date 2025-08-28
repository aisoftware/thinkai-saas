import { AppConfiguration } from "~/utils/db/appConfiguration.db.server";

type EmailTemplate = {
  name: string;
  description: string;
  parse: (data: { appConfiguration: AppConfiguration; data: any }) => {
    subject: string;
    body: string;
  };
};

const WELCOME_EMAIL = {
  name: "welcome",
  description: "Welcome email with login link",
  parse: ({ appConfiguration, data }: { appConfiguration: AppConfiguration; data: { name?: string; action_url: string } }) => {
    const subject = !data.name ? `Welcome to ${appConfiguration.app.name}!` : `Welcome to ${appConfiguration.app.name}, ${data.name}!`;
    const greetings = data.name ? `Welcome, ${data.name}!` : "Welcome!";
    const body = `<p>${greetings}</p>
<p>Thanks for trying ${appConfiguration.app.name}.</p>

<a href="${data.action_url}" target="_blank">Click here to log in</a>.

${appConfiguration.email.supportEmail && `<p>If you have any questions, feel free to <a href="mailto:${appConfiguration.email.supportEmail}">email us</a>.`}

<p>Thanks,
<br>-
<br>${appConfiguration.email.fromName}</p>
`;
    return { subject, body, data };
  },
};

const PASSWORD_RESET_EMAIL = {
  name: "password-reset",
  description: "Email sent to users who requested a password reset",
  parse: ({ appConfiguration, data }: { appConfiguration: AppConfiguration; data: { name?: string; action_url: string } }) => {
    const subject = `Set up a new password for ${appConfiguration.app.name}`;
    const greetings = data.name ? `Hello, ${data.name}!` : "Hello!";
    const body = `<p>${greetings}</p>
<p>You recently requested to reset your password for your ${appConfiguration.app.name} account.</p>

<a href="${data.action_url}" target="_blank">Reset password</a>.

<p>If you did not request a password reset, please ignore this email or <a href="mailto:${appConfiguration.email.supportEmail}">contact support</a> if you have questions.</p>

<p>Thanks,
<br>-
<br>${appConfiguration.email.fromName}</p>
`;
    return { subject, body, data };
  },
};

const USER_INVITATION_EMAIL = {
  name: "user-invitation",
  description: "Email sent to users who are invited to join an organization",
  parse: ({
    appConfiguration,
    data,
  }: {
    appConfiguration: AppConfiguration;
    data: { name?: string; invite_sender_name: string; invite_sender_organization: string; action_url: string };
  }) => {
    const subject = `${data.invite_sender_name} invited you to ${appConfiguration.app.name}`;
    const greetings = data.name ? `Hello, ${data.name}!` : "Hello!";
    const body = `<p>${greetings}</p>
<p>${data.invite_sender_name} with ${data.invite_sender_organization} has invited you to use ${appConfiguration.app.name} to collaborate with them.</p>

<a href="${data.action_url}" target="_blank">Join ${data.invite_sender_organization}</a>.

${appConfiguration.email.supportEmail && `<p>If you have any questions, feel free to <a href="mailto:${appConfiguration.email.supportEmail}">email us</a>.`}

<p>Thanks,
<br>-
<br>${appConfiguration.email.fromName}</p>
`;
    return { subject, body, data };
  },
};

const VERIFICATION_EMAIL = {
  name: "email-verification",
  description: "Email sent to users to verify their email address",
  parse: ({ appConfiguration, data }: { appConfiguration: AppConfiguration; data: { name?: string; action_url: string } }) => {
    const subject = `Verify your email address with ${appConfiguration.app.name}`;
    const greetings = data.name ? `Thanks for signing up, ${data.name}!` : "Thanks for signing up!";
    const body = `<p>${greetings}</p>

<a href="${data.action_url}" target="_blank">Click here to verify your email</a>.

${appConfiguration.email.supportEmail && `<p>If you have any questions, feel free to <a href="mailto:${appConfiguration.email.supportEmail}">email us</a>.`}

<p>Thanks,
<br>-
<br>${appConfiguration.email.fromName}</p>`;
    return { subject, body, data };
  },
};

const ACCOUNT_SETUP_EMAIL: EmailTemplate = {
  name: "account-setup",
  description: "Email sent to users to set up their account",
  parse: ({ appConfiguration, data }: { appConfiguration: AppConfiguration; data: { email: string; plan: string; action_url: string } }) => {
    const subject = `Set up your account for ${appConfiguration.app.name}`;
    const body = `<p>Thank you for subscribing to ${appConfiguration.app.name}!</p>

If you haven't already, <a href="${data.action_url}" target="_blank">click here to</a> set up your account.

<p>Thanks,
<br>-
<br>${appConfiguration.email.fromName}</p>`;
    return { subject, body, data };
  },
};

const allTemplates: EmailTemplate[] = [
  WELCOME_EMAIL, // Welcome email with login link
  PASSWORD_RESET_EMAIL, // Token to reset password
  USER_INVITATION_EMAIL, // Link to join an account
  VERIFICATION_EMAIL, // Token to verify email
  ACCOUNT_SETUP_EMAIL, // Link after checkout
];

export default {
  allTemplates,
  WELCOME_EMAIL,
  PASSWORD_RESET_EMAIL,
  USER_INVITATION_EMAIL,
  VERIFICATION_EMAIL,
  ACCOUNT_SETUP_EMAIL,
};
