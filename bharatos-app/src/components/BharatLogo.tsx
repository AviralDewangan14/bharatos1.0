interface BharatLogoProps {
  size?: number;
  className?: string;
  variant?: 'color' | 'monochrome' | 'glow';
}

export function BharatLogo({ size = 32, className = '', variant = 'color' }: BharatLogoProps) {
  if (variant === 'monochrome') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M24 4L40 13.2376V31.7624L24 41L8 31.7624V13.2376L24 4Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="22.5" r="5" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 31V35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 18.5L16.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M31.5 24.5L35 26.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 26.5L16.5 24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M31.5 20.5L35 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bharatSaffron" x1="8" y1="4" x2="40" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7722" />
          <stop offset="1" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id="bharatEmerald" x1="8" y1="24" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="bharatCore" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF7722" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Hexagonal Outer Frame with Precision Geometry */}
      <path
        d="M24 4.5L39.5 13.4485V31.3515L24 40.3L8.5 31.3515V13.4485L24 4.5Z"
        stroke="url(#bharatSaffron)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={variant === 'glow' ? 'url(#logoGlow)' : undefined}
      />

      {/* Top Saffron Crest Wing */}
      <path
        d="M17 14.5L24 10.5L31 14.5"
        stroke="url(#bharatSaffron)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom Emerald Foundation Wing */}
      <path
        d="M17 30.5L24 34.5L31 30.5"
        stroke="url(#bharatEmerald)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Chakra Core */}
      <circle
        cx="24"
        cy="22.5"
        r="5.5"
        fill="url(#bharatCore)"
        stroke="#60A5FA"
        strokeWidth="1.5"
      />

      {/* Radiant Spoke Rays */}
      <circle cx="24" cy="22.5" r="1.75" fill="#FFFFFF" />
      <path d="M24 17V15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 30V28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 22.5H17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M31 22.5H29" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
