import { useLocation, useNavigate } from "react-router";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputSelectorDarkMode from "~/components/ui/input/dark/InputSelectorDarkMode";
import { useAppData } from "~/utils/data/useAppData";

interface Props {
  className?: string;
}

export default function TenantSelector({ className }: Props) {
  const { t } = useTranslation();
  const appData = useAppData();
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(appData?.currentTenant?.slug);

  useEffect(() => {
    if (selected) {
      const tenant = appData.myTenants.find((f) => f.slug === selected);
      if (tenant && tenant.id !== appData.currentTenant.id) {
        navigate(
          location.pathname
            .replace(`/app/${appData?.currentTenant.slug}`, `/app/${tenant.slug}`)
            .replace(`/app/${appData?.currentTenant.id}`, `/app/${tenant.slug}`)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function getAllTenants() {
    const items = appData.myTenants
      .map((f) => {
        let group = t("models.tenant.plural");
        if (f.types.length > 0) {
          group = f.types[0].titlePlural ?? t("models.tenant.plural");
        }
        return {
          group,
          value: f.slug,
          name: f.name,
          img: f.icon ? (
            <img className="inline-block h-6 w-6 shrink-0 rounded-md bg-gray-700 shadow-xs" src={f.icon} alt={f.name} />
          ) : (
            <span className="bg-primary inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
              <span className="text-theme-200 text-xs font-medium leading-none">{f?.name.substring(0, 1)}</span>
            </span>
          ),
          // link: location.pathname.replace(`/app/${appData.currentTenant.slug}`, `/app/${f?.slug}`),
        };
      })
      .sort((a, b) => a.group.localeCompare(b.group));
    // return unique slugs
    const unique = items.filter((item, index, self) => self.findIndex((t) => t.value === item.value) === index);
    return unique;
  }
  return (
    <Fragment>
      {appData.myTenants.length > 1 && (
        <InputSelectorDarkMode
          withSearch={false}
          value={selected}
          renderSelected={(e) => {
            const tenant = appData.myTenants.find((f) => f.slug === e.value);
            return <div>{tenant?.name}</div>;
          }}
          options={getAllTenants()}
          setValue={(e) => setSelected(e?.toString() ?? "")}
        />
      )}
    </Fragment>
  );
}
