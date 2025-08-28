import { useTranslation } from "react-i18next";
import { NewsletterBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/newsletter/NewsletterBlockUtils";
import { useRootData } from "~/utils/data/useRootData";
import { useState } from "react";
import RecaptchaWrapper from "~/components/recaptcha/RecaptchaWrapper";
import HoneypotInput from "~/components/ui/honeypot/HoneypotInput";
import InputText from "~/components/ui/input/InputText";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import SuccessBanner from "~/components/ui/banners/SuccessBanner";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import clsx from "clsx";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import { useFetcher } from "react-router";

export default function NewsletterVariantSimple({ item }: { item: NewsletterBlockDto }) {
  const { t } = useTranslation();
  return (
    <div>
      <section className="body-font">
        <div className="container mx-auto space-y-8 px-5 py-24 sm:space-y-12">
          <div className="space-y-5 text-center sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
            {item.headline && <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">{t(item.headline)}</h2>}
            {item.subheadline && <p className="mx-auto max-w-3xl text-center text-xl">{t(item.subheadline)}</p>}

            {item.cta && (
              <div className="flex flex-col justify-center space-y-1 sm:flex-row sm:space-x-2 sm:space-y-0">
                {item.cta.map((item) => {
                  return (
                    <div key={item.href} className="rounded-md ">
                      {item.href.startsWith("http") ? (
                        <ButtonEvent
                          to={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className={clsx(
                            "hover:bg-secondary/90 group flex w-full items-center justify-center space-x-2 truncate rounded-md border px-8 py-3 text-base font-medium md:px-4 md:py-2 dark:hover:bg-gray-900"
                          )}
                          event={{ action: "click", category: "community", label: item.text, value: item.href }}
                        >
                          {t(item.text)}
                        </ButtonEvent>
                      ) : (
                        <ButtonEvent
                          to={item.href}
                          className={clsx(
                            "hover:bg-secondary/90 group flex w-full items-center justify-center space-x-2 truncate rounded-md border px-8 py-3 text-base font-medium md:px-4 md:py-2 dark:hover:bg-gray-900"
                          )}
                          event={{ action: "click", category: "community", label: item.text, value: item.href }}
                        >
                          {t(item.text)}
                        </ButtonEvent>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {/* <div className="text-muted-foreground mt-3 text-sm">
              {t("front.newsletter.weCare")}{" "}
              <Link to="/privacy-policy" className="font-medium underline">
                {t("front.privacy.title")}
              </Link>
            </div> */}
          </div>

          <RecaptchaWrapper enabled>
            <NewsletterForm />
          </RecaptchaWrapper>
        </div>
      </section>

      {/* <section id="entity-builder-demo" className="body-font mx-auto bg-background text-foreground sm:max-w-xl lg:max-w-7xl">
        <div className="container mx-auto space-y-8 px-5 py-24 sm:space-y-12">
          <div className="space-y-5 text-center sm:mx-auto sm:space-y-4">
            <div className="space-y-1">
              <h2 className="text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Entity Builder Demo</h2>
            </div>
            <p className="mx-auto max-w-2xl text-center text-xl text-muted-foreground">Build powerful no-code applications with Entity Builder.</p>
          </div>
          <div className="mt-12">
            <EntityBuilderDemo />
          </div>
        </div>
      </section> */}
    </div>
  );
}

export function NewsletterForm({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const { csrf } = useRootData();
  const [email, setEmail] = useState("");
  const fetcher = useFetcher<{ subscription?: string; error?: string; success?: string }>();
  const state: "idle" | "success" | "error" | "submitting" =
    fetcher.state === "submitting" ? "submitting" : fetcher.data?.subscription ? "success" : fetcher.data?.error ? "error" : "idle";
  return (
    <fetcher.Form id="newsletter-form" method="post" action="/newsletter" className="mx-auto flex w-full max-w-xl flex-col items-end space-y-4 px-8 sm:px-0">
      <input type="hidden" name="csrf" value={csrf} hidden readOnly />
      <HoneypotInput />
      <input type="hidden" name="source" value="block" hidden readOnly />
      <HoneypotInput />
      <div className="relative w-full grow">
        {/* <label htmlFor="email" className="text-sm leading-7 text-muted-foreground">
                  {t("front.newsletter.email")} <span className="ml-1 text-red-500">*</span>
                </label> */}
        <InputText
          title={t("front.newsletter.email")}
          type="text"
          id="email"
          name="email"
          required
          value={email}
          setValue={(e) => setEmail(e)}
          // className="focus:border-theme-500 focus:ring-theme-200 dark:focus:ring-theme-800 w-full rounded border border-border bg-secondary/90 opacity-50 px-3 py-1 text-base leading-8 text-foreground/80 outline-hidden transition-colors duration-200 ease-in-out focus:bg-transparent focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-muted-foreground"
        />
      </div>
      <div className="flex w-full items-center space-x-4">
        <div className="relative w-1/2 grow">
          {/* <label htmlFor="first_name" className="text-sm leading-7 text-muted-foreground">
                    {t("front.newsletter.firstName")} <span className="ml-1 text-red-500">*</span>
                  </label> */}
          <InputText
            type="text"
            title={t("front.newsletter.firstName")}
            id="first_name"
            name="first_name"
            required
            defaultValue=""
            // className="focus:border-theme-500 focus:ring-theme-200 dark:focus:ring-theme-800 w-full rounded border border-border bg-secondary/90 opacity-50 px-3 py-1 text-base leading-8 text-foreground/80 outline-hidden transition-colors duration-200 ease-in-out focus:bg-transparent focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-muted-foreground"
          />
        </div>
        <div className="relative w-1/2 grow">
          {/* <label htmlFor="last_name" className="text-sm leading-7 text-muted-foreground">
                    {t("front.newsletter.lastName")} <span className="ml-1 text-red-500">*</span>
                  </label> */}
          <InputText
            type="text"
            title={t("front.newsletter.lastName")}
            id="last_name"
            name="last_name"
            required
            defaultValue=""
            // className="focus:border-theme-500 focus:ring-theme-200 dark:focus:ring-theme-800 w-full rounded border border-border bg-secondary/90 opacity-50 px-3 py-1 text-base leading-8 text-foreground/80 outline-hidden transition-colors duration-200 ease-in-out focus:bg-transparent focus:ring-2 dark:border-gray-700 dark:bg-gray-800 dark:text-muted-foreground"
          />
        </div>
      </div>
      {fetcher.data && (
        <div className="mt-3">
          {fetcher.data.success ? (
            <div>
              <SuccessBanner title={t("shared.subscribed")} text={fetcher.data.success} />
            </div>
          ) : fetcher.data.error ? (
            <ErrorBanner title={t("shared.error")} text={fetcher.data.error} />
          ) : null}
        </div>
      )}
      <div className="mt-3 flex w-full items-center justify-end space-x-2">
        {/* <div className="">
          {fetcher.data?.success ? <p>{fetcher.data.success}</p> : fetcher.data?.error ? <p>{fetcher.data.error}</p> : <div className="invisible">...</div>}
        </div> */}
        <div className="flex items-center space-x-2">
          {onClose && (
            <ButtonSecondary onClick={onClose} type="button">
              {t("shared.close")}
            </ButtonSecondary>
          )}
          <ButtonPrimary
            event={{ action: "click", category: "newsletter", label: "subscribe", value: email }}
            type="submit"
            disabled={!email || state === "submitting"}
            // className={clsx(
            //   "bg-theme-500 hover:bg-theme-600 inline-flex justify-center rounded-md border-0 px-4 py-2 text-base text-white shadow-2xs focus:outline-hidden"
            // )}
            sendEvent={!!email}
          >
            {state === "submitting" ? t("front.newsletter.subscribing") + "..." : t("front.newsletter.subscribe")}
          </ButtonPrimary>
        </div>
      </div>
    </fetcher.Form>
  );
}
