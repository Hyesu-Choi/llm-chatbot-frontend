type Props = {
  className?: string;
};

export function AssistantMark({ className = "" }: Props) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="currentColor">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
      </svg>
    </span>
  );
}
