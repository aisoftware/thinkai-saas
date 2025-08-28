import Logo from "~/components/brand/Logo";
import LoadingButton, { RefLoadingButton } from "~/components/ui/buttons/LoadingButton";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import UserUtils from "~/utils/app/UserUtils";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, Form, useActionData, useLoaderData } from "react-router";
import { ActionFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getUser, getUserByEmail, register } from "~/utils/db/users.db.server";
import { sendEmail } from "~/modules/emails/services/EmailService";
import { getUserInvitation, updateUserInvitationPending } from "~/utils/db/tenantUserInvitations.db.server";
import { createTenantUser, getTenant } from "~/utils/db/tenants.db.server";
import { createUserSession, getUserInfo, setLoggedUser } from "~/utils/session.server";
import { TenantUserInvitation, Tenant, User } from "@prisma/client";
import { getAllRoles } from "~/utils/db/permissions/roles.db.server";
import { TenantUserType } from "~/application/enums/tenants/TenantUserType";
import { getBaseURL } from "~/utils/url.server";
import EventsService from "~/modules/events/services/.server/EventsService";
import { MemberInvitationAcceptedDto } from "~/modules/events/dtos/MemberInvitationAcceptedDto";
import SuccessBanner from "~/components/ui/banners/SuccessBanner";
import { Button } from "~/components/ui/button";
import EmailTemplates from "~/modules/emails/utils/EmailTemplates";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";

type LoaderData = {
  title: string;
  invitation: (TenantUserInvitation & { tenant: Tenant }) | null;
  existingUser: User | null;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);

  const invitation = await getUserInvitation(params.id ?? "");
  const existingUser = await getUserByEmail(invitation?.email);
  const data: LoaderData = {
    title: `${t("account.invitation.title")} | ${process.env.APP_NAME}`,
    invitation,
    existingUser,
  };
  return data;
};

type ActionData = {
  success?: string;
  error?: string;
  invitationAccepted?: boolean;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const password = form.get("password")?.toString() ?? "";
  const passwordConfirm = form.get("password-confirm")?.toString() ?? "";

  const invitation = await getUserInvitation(params.id ?? "");
  if (!invitation) {
    return badRequest({
      error: "Invalid invitation",
    });
  }
  const fromUser = invitation.fromUserId ? await getUser(invitation.fromUserId) : null;

  let existingUser = await getUserByEmail(invitation.email);
  if (!existingUser) {
    // Register user
    const passwordError = UserUtils.validatePasswords({ t, password, passwordConfirm });
    if (passwordError) {
      return badRequest({ error: passwordError });
    }

    const user = await register({
      email: invitation.email,
      password,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      locale: userInfo.lng,
      request,
    });
    if (!user) {
      return badRequest({ error: "Could not create user" });
    }
    await updateUserInvitationPending(invitation.id);
    const roles = await getAllRoles("app");
    await createTenantUser(
      {
        tenantId: invitation.tenantId,
        userId: user.id,
        type: invitation.type,
      },
      roles.filter((f) => f.assignToNewUsers)
    );
    await EventsService.create({
      request,
      event: "member.invitation.accepted",
      tenantId: invitation.tenant.id,
      userId: user.id,
      data: {
        newUser: true,
        tenant: { id: invitation.tenantId, name: invitation.tenant.name, slug: invitation.tenant.slug },
        user: { id: user.id, email: user.email, firstName: invitation.firstName, lastName: invitation.lastName, type: TenantUserType[invitation.type] },
        fromUser: !fromUser ? null : { id: fromUser.id, email: fromUser.email },
        invitation: { id: invitation.id },
      } satisfies MemberInvitationAcceptedDto,
    });

    await sendEmail({
      request,
      to: invitation.email,
      alias: "welcome",
      ...EmailTemplates.WELCOME_EMAIL.parse({
        appConfiguration: await getAppConfiguration({ request }),
        data: {
          action_url: getBaseURL(request) + `/login`,
          name: invitation.firstName,
        },
      }),
    });

    const userSession = await setLoggedUser(user);
    const tenant = await getTenant(userSession.defaultTenantId);
    return createUserSession(
      {
        ...userInfo,
        ...userSession,
        userId: user.id,
        lng: user.locale ?? userInfo.lng,
      },
      tenant ? `/app/${tenant.slug ?? tenant.id}/dashboard` : "/app"
    );
  } else {
    // Existing user
    await updateUserInvitationPending(invitation.id);
    const roles = await getAllRoles("app");
    await createTenantUser(
      {
        tenantId: invitation.tenantId,
        userId: existingUser.id,
        type: invitation.type,
      },
      roles.filter((f) => f.assignToNewUsers)
    );
    await EventsService.create({
      request,
      event: "member.invitation.accepted",
      tenantId: invitation.tenant.id,
      userId: existingUser.id,
      data: {
        newUser: false,
        tenant: { id: invitation.tenantId, name: invitation.tenant.name, slug: invitation.tenant.slug },
        fromUser: !fromUser ? null : { id: fromUser.id, email: fromUser.email },
        user: {
          id: existingUser.id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          type: TenantUserType[invitation.type],
        },
        invitation: { id: invitation.id },
      } satisfies MemberInvitationAcceptedDto,
    });

    return { invitationAccepted: true };
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function InvitationRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const { t } = useTranslation();

  const loadingButton = useRef<RefLoadingButton>(null);
  const errorModal = useRef<RefErrorModal>(null);

  useEffect(() => {
    if (actionData?.error) {
      errorModal.current?.show(actionData.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  return (
    <div>
      <div>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Logo className="mx-auto h-12 w-auto" />
          </div>
          {(() => {
            if (!data.invitation?.pending || actionData?.invitationAccepted) {
              return (
                <div className="mt-3 w-full space-y-5">
                  <div className="flex flex-col items-center ">
                    <h1 className="text-left text-xl font-extrabold">Invitation Accepted</h1>
                    <div className="mx-auto mt-4 w-full max-w-sm space-y-5">
                      <div className="w-full">
                        <SuccessBanner title={t("shared.success")} text="You have successfully accepted the invitation" />
                      </div>
                      <div className="flex w-full justify-end">
                        <Button asChild variant="outline">
                          <Link to="/app">{t("account.shared.signIn")}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else if (!data.invitation) {
              return <div className="text-center text-red-500">{t("shared.invalidInvitation")}</div>;
            } else {
              return (
                <div>
                  <h2 className="text-foreground mt-6 text-center text-lg font-extrabold dark:text-slate-200">
                    {t("shared.hi")} {data.invitation.firstName ? data.invitation.firstName : data.invitation.email}, {t("account.invitation.youWereInvited")}{" "}
                    {data.invitation.tenant.name}
                  </h2>
                  <p className="max-w text-muted-foreground mt-2 text-center text-sm leading-5">
                    {t("account.register.alreadyRegistered")}{" "}
                    <span className="text-primary font-medium hover:underline">
                      <Link to="/login">{t("account.register.clickHereToLogin")}</Link>
                    </span>
                  </p>

                  <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="px-4 py-8 sm:rounded-sm sm:px-10">
                      <Form method="post" className="sm:w-96">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium leading-5">
                            {t("account.shared.email")}
                          </label>
                          <div className="mt-1 rounded-sm shadow-2xs">
                            <input
                              disabled={true}
                              type="email"
                              id="email"
                              name="email"
                              defaultValue={data.invitation.email}
                              required
                              className="focus:border-theme-500 focus:ring-ring border-border text-foreground bg-secondary/90 relative block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-500 focus:z-10 focus:outline-hidden sm:text-sm dark:border-gray-700 dark:bg-slate-800 dark:text-slate-200"
                            />
                          </div>
                        </div>
                        {!data.existingUser && (
                          <>
                            <div className="mt-6">
                              <label htmlFor="password" className="block text-sm font-medium leading-5">
                                {t("account.shared.password")}
                              </label>
                              <div className="mt-1 rounded-sm shadow-2xs">
                                <input
                                  type="password"
                                  id="password"
                                  name="password"
                                  required
                                  className="focus:border-theme-500 focus:ring-ring border-border text-foreground relative block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-500 focus:z-10 focus:outline-hidden sm:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-slate-200"
                                />
                              </div>
                            </div>
                            <div className="mt-6">
                              <label htmlFor="password-confirm" className="block text-sm font-medium leading-5">
                                {t("account.register.confirmPassword")}
                              </label>
                              <div className="mt-1 rounded-sm shadow-2xs">
                                <input
                                  type="password"
                                  id="password-confirm"
                                  name="password-confirm"
                                  required
                                  className="focus:border-theme-500 focus:ring-ring border-border text-foreground relative block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-500 focus:z-10 focus:outline-hidden sm:text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-slate-200"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="mt-6">
                          <span className="block w-full rounded-sm shadow-2xs">
                            <LoadingButton className="block w-full" type="submit" ref={loadingButton}>
                              {t("account.invitation.button")}
                            </LoadingButton>
                          </span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              );
            }
          })()}
        </div>
        <ErrorModal ref={errorModal} />
      </div>
    </div>
  );
}
