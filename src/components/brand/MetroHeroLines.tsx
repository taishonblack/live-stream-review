import { cn } from "@/lib/utils";

interface MetroHeroLinesProps {
  className?: string;
  animated?: boolean;
}

export function MetroHeroLines({ className, animated = true }: MetroHeroLinesProps) {
  return (
    <svg
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Gradient for lines fading at edges */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="15%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="85%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Line 1 - Green (top) */}
      <g className="text-status-ok">
        <path
          d="M0 180 H400 Q450 180 480 210 L520 250 Q550 280 600 280 H700 Q750 280 780 250 L820 210 Q850 180 900 180 H1200"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
        {animated && (
          <path
            d="M0 180 H400 Q450 180 480 210 L520 250 Q550 280 600 280 H700 Q750 280 780 250 L820 210 Q850 180 900 180 H1200"
            stroke="hsl(var(--status-ok))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="metro-line-animated"
            opacity="0.6"
          />
        )}
        {/* Stations */}
        <circle cx="200" cy="180" r="4" fill="hsl(var(--status-ok))" opacity="0.5" />
        <circle cx="600" cy="280" r="5" fill="hsl(var(--status-ok))" opacity="0.7" />
      </g>

      {/* Line 2 - Blue (middle-upper) */}
      <g className="text-primary">
        <path
          d="M0 260 H350 Q400 260 430 290 L470 330 Q500 360 550 360 H650 Q700 360 730 330 L770 290 Q800 260 850 260 H1200"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        {animated && (
          <path
            d="M0 260 H350 Q400 260 430 290 L470 330 Q500 360 550 360 H650 Q700 360 730 330 L770 290 Q800 260 850 260 H1200"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="metro-line-animated"
            style={{ animationDelay: "-2s" }}
            opacity="0.7"
          />
        )}
        {/* Stations */}
        <circle cx="300" cy="260" r="4" fill="hsl(var(--primary))" opacity="0.5" />
        <circle cx="600" cy="360" r="6" fill="hsl(var(--primary))" opacity="0.8" />
        <circle cx="900" cy="260" r="4" fill="hsl(var(--primary))" opacity="0.5" />
      </g>

      {/* Line 3 - Amber (middle-lower) */}
      <g className="text-status-warning">
        <path
          d="M0 340 H300 Q350 340 380 310 L420 270 Q450 240 500 240 H700 Q750 240 780 270 L820 310 Q850 340 900 340 H1200"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        />
        {animated && (
          <path
            d="M0 340 H300 Q350 340 380 310 L420 270 Q450 240 500 240 H700 Q750 240 780 270 L820 310 Q850 340 900 340 H1200"
            stroke="hsl(var(--status-warning))"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="metro-line-animated"
            style={{ animationDelay: "-4s" }}
            opacity="0.5"
          />
        )}
        {/* Stations */}
        <circle cx="600" cy="240" r="4" fill="hsl(var(--status-warning))" opacity="0.5" />
      </g>

      {/* Line 4 - Gray/muted (bottom) */}
      <g className="text-muted-foreground">
        <path
          d="M0 420 H450 Q500 420 530 390 L570 350 Q600 320 650 320 H1200"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.25"
        />
        {/* Station */}
        <circle cx="400" cy="420" r="3" fill="hsl(var(--muted-foreground))" opacity="0.4" />
      </g>

      {/* Central convergence hub */}
      <circle cx="600" cy="300" r="12" fill="hsl(var(--panel))" stroke="hsl(var(--primary))" strokeWidth="2" />
      <circle cx="600" cy="300" r="6" fill="hsl(var(--primary))" />
    </svg>
  );
}