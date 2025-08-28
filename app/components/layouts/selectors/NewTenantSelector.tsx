import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import InputSelector from "~/components/ui/input/InputSelector";
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
      const tenant = appData?.myTenants.find((f) => f.slug === selected);
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
    const items = appData?.myTenants
      .map((f) => {
        let group = t("models.tenant.plural");
        if (f.types.length > 0) {
          group = f.types[0].titlePlural ?? t("models.tenant.plural");
        }
        return {
          group,
          value: f.slug,
          name: (
            <div className="flex items-center space-x-2">
              {f.icon ? (
                <img className="inline-block h-4 w-4 shrink-0 rounded-md shadow-xs" src={f.icon} alt={f.name} />
              ) : (
                <span className="bg-primary inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md">
                  <span className="text-primary-foreground text-xs font-medium leading-none">{f?.name.substring(0, 1)}</span>
                </span>
              )}
              <div>{f.name}</div>
            </div>
          ),
          // link: location.pathname.replace(`/app/${appData.currentTenant.slug}`, `/app/${f?.slug}`),
        };
      })
      .sort((a, b) => a.group.localeCompare(b.group));
    // return unique slugs
    const unique = items.filter((item, index, self) => self.findIndex((t) => t.value === item.value) === index);
    return [
      ...unique,
      {
        title: "hey",
        value: "{new}",
        className: "border-t border-border rounded-none",
        name: (
          <div className="flex items-center gap-2">
            <div className="w-4 shrink-0">
              <PlusIcon className="h-4 w-4 p-0.5" />
            </div>
            <div>{t("app.tenants.create.title")}</div>
          </div>
        ),
      },
    ];
  }
  return (
    <div className="text-foreground">
      {appData?.myTenants.length > 1 && (
        <InputSelector
          selectPlaceholder=""
          withSearch={false}
          value={selected}
          options={getAllTenants()}
          setValue={(e) => {
            if (e === "{new}") {
              navigate("/new-account");
              setSelected(e?.toString() ?? "");
            } else {
              setSelected(e?.toString() ?? "");
            }
          }}
        />
      )}
    </div>
  );
}
