import { cn } from "@/lib/utils";

interface TecqLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
}

export function TecqLogo({ className, size = "md", showSubtitle = true }: TecqLogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-sm", subtitle: "text-[9px]" },
    md: { icon: 40, text: "text-base", subtitle: "text-[10px]" },
    lg: { icon: 48, text: "text-lg", subtitle: "text-xs" },
  };

  const { icon, text, subtitle } = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Metro-style icon: 3 lines converging into a hub */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Input lines */}
        <path
          d="M4 10 H16 Q20 10 20 14 V18"
          stroke="hsl(var(--status-ok))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M4 20 H18"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M4 30 H16 Q20 30 20 26 V22"
          stroke="hsl(var(--status-warning))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Central hub */}
        <circle cx="20" cy="20" r="4" fill="hsl(var(--primary))" />
        
        {/* Output line */}
        <path
          d="M24 20 H36"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.6"
        />
        
        {/* Station dots */}
        <circle cx="4" cy="10" r="2" fill="hsl(var(--status-ok))" />
        <circle cx="4" cy="20" r="2" fill="hsl(var(--primary))" />
        <circle cx="4" cy="30" r="2" fill="hsl(var(--status-warning))" />
        <circle cx="36" cy="20" r="2" fill="hsl(var(--foreground))" fillOpacity="0.6" />
      </svg>

      <div className="flex flex-col">
        <span className={cn("font-bold tracking-wide text-foreground", text)}>
          TECQ SRT
        </span>
        {showSubtitle && (
          <span className={cn("font-medium text-muted-foreground uppercase tracking-wider", subtitle)}>
            Signal Review
          </span>
        )}
      </div>
    </div>
  );
}
