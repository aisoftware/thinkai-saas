import { ExternalLinkIcon } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function MyBillingSession({ onClick }: Props) {
  return (
    <div className="space-y-2">
      <div className="mt-3">
        <button
          type="button"
          onClick={onClick}
          className="border-border hover:border-border relative block w-full rounded-lg border-2 border-dashed p-4 text-center focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ExternalLinkIcon className="text-muted-foreground mx-auto h-4" />
          <span className="text-foreground mt-2 block text-sm font-medium">Open Billing Portal</span>
        </button>
      </div>
    </div>
  );
}
