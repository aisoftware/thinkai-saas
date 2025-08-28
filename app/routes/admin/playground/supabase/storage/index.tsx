import { MetaFunction } from "react-router";
import { Link } from "react-router";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";

export const meta: MetaFunction = () => {
  return [{ title: "Supabase Playground" }];
};

export default function () {
  return (
    <IndexPageLayout title="Supabase Playground">
      <div className="grid gap-4">
        <Link
          to={`/admin/playground/supabase/storage/buckets`}
          className="border-border focus:bg-background hover:border-border relative flex w-full flex-col justify-center space-y-2 rounded-lg border-2 border-dashed p-6 text-center focus:border-2 focus:border-gray-600 focus:outline-hidden"
        >
          <div className="text-foreground block text-sm font-medium">Buckets</div>
          <div className="text-muted-foreground block text-xs">Storage files in buckets</div>
        </Link>
      </div>
    </IndexPageLayout>
  );
}
