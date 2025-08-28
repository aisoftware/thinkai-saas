export default function OptionsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <div className="hover:bg-secondary hover:border-border text-muted-foreground bg-background inline-flex w-full justify-center rounded-md border border-transparent p-1 text-sm font-medium hover:shadow-2xs focus:outline-hidden">
      <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    </div>
  );
}
