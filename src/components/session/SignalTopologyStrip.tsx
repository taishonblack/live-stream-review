import { StreamHealth } from '@/types/session';
import { cn } from '@/lib/utils';

interface SignalTopologyStripProps {
  inputs: Array<{
    position: number;
    name: string;
    health: StreamHealth;
  }>;
  viewerCount: number;
  isLive: boolean;
}

export function SignalTopologyStrip({ inputs, viewerCount, isLive }: SignalTopologyStripProps) {
  const getHealthColor = (health: StreamHealth) => {
    switch (health) {
      case 'ok': return 'hsl(var(--status-ok))';
      case 'warning': return 'hsl(var(--status-warning))';
      case 'error': return 'hsl(var(--status-error))';
      case 'off': return 'hsl(var(--status-off))';
    }
  };

  const activeInputs = inputs.filter(i => i.health !== 'off');

  return (
    <div className="h-10 bg-panel/50 border-b border-border flex items-center justify-center px-4">
      <svg
        className="w-full max-w-3xl h-8"
        viewBox="0 0 600 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Input lines converging to hub */}
        {inputs.map((input, index) => {
          const startY = 4 + index * 7;
          const endY = 16;
          const color = getHealthColor(input.health);
          const isActive = input.health !== 'off';
          
          return (
            <g key={input.position}>
              {/* Line path */}
              <path
                d={`M40 ${startY} H180 Q200 ${startY} 220 ${(startY + endY) / 2} L260 ${endY} H300`}
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity={isActive ? 0.6 : 0.2}
              />
              
              {/* Animated flow (only for live & active) */}
              {isLive && isActive && (
                <path
                  d={`M40 ${startY} H180 Q200 ${startY} 220 ${(startY + endY) / 2} L260 ${endY} H300`}
                  stroke={color}
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  className="metro-line-animated"
                  style={{ animationDelay: `${-index * 2}s` }}
                  opacity="0.8"
                />
              )}
              
              {/* Input station */}
              <circle
                cx="40"
                cy={startY}
                r="3"
                fill={color}
                opacity={isActive ? 1 : 0.3}
              />
              
              {/* Input label */}
              <text
                x="20"
                y={startY + 1}
                fill="hsl(var(--muted-foreground))"
                fontSize="6"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {input.position}
              </text>
            </g>
          );
        })}

        {/* Central hub (TECQ SRT station) */}
        <circle
          cx="300"
          cy="16"
          r="8"
          fill="hsl(var(--panel))"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        <circle cx="300" cy="16" r="4" fill="hsl(var(--primary))" />
        
        {/* Hub label */}
        <text
          x="300"
          y="30"
          fill="hsl(var(--muted-foreground))"
          fontSize="5"
          fontFamily="Inter, sans-serif"
          textAnchor="middle"
        >
          HUB
        </text>

        {/* Output line to viewers */}
        <path
          d="M308 16 H560"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
        />
        
        {isLive && activeInputs.length > 0 && (
          <path
            d="M308 16 H560"
            stroke="hsl(var(--foreground))"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="metro-line-animated"
            style={{ animationDelay: "-1s" }}
            opacity="0.5"
          />
        )}

        {/* Viewer station */}
        <circle
          cx="560"
          cy="16"
          r="3"
          fill="hsl(var(--foreground))"
          opacity={isLive ? 0.7 : 0.3}
        />
        
        {/* Viewer count */}
        <text
          x="580"
          y="17"
          fill="hsl(var(--muted-foreground))"
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          textAnchor="start"
          dominantBaseline="middle"
        >
          {viewerCount}
        </text>
      </svg>
    </div>
  );
}