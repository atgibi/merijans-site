export default function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 280 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="logoGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      {/* Stylized M mark with airplane/globe fusion */}
      <g transform="translate(2, 4)">
        {/* Globe circle */}
        <circle cx="24" cy="24" r="20" stroke="url(#logoGrad1)" strokeWidth="2" fill="none" opacity="0.3" />
        <circle cx="24" cy="24" r="14" stroke="url(#logoGrad1)" strokeWidth="1.5" fill="none" opacity="0.2" />
        
        {/* Globe latitude lines */}
        <ellipse cx="24" cy="24" rx="20" ry="8" stroke="url(#logoGrad1)" strokeWidth="1" fill="none" opacity="0.15" />
        <ellipse cx="24" cy="24" rx="20" ry="14" stroke="url(#logoGrad1)" strokeWidth="1" fill="none" opacity="0.15" />
        
        {/* Main M letterform - stylized with movement */}
        <path
          d="M10 38 L10 12 L16 12 L24 28 L32 12 L38 12 L38 38 L33 38 L33 22 L26 36 L22 36 L15 22 L15 38 Z"
          fill="url(#logoGrad2)"
        />
        
        {/* Airplane trail accent */}
        <path
          d="M36 8 Q42 6 46 10"
          stroke="url(#logoGrad3)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <circle cx="47" cy="11" r="1.5" fill="url(#logoGrad3)" opacity="0.7" />
        
        {/* Small dots accent */}
        <circle cx="38" cy="6" r="1" fill="#06b6d4" opacity="0.5" />
        <circle cx="42" cy="4" r="0.8" fill="#a855f7" opacity="0.4" />
      </g>

      {/* Company name */}
      <g transform="translate(56, 8)">
        {/* MERIJANS text */}
        <text
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize="24"
          fontWeight="800"
          letterSpacing="-0.5"
          fill="url(#logoGrad2)"
        >
          MERIJANS
        </text>
        
        {/* Decorative underline */}
        <rect x="0" y="28" width="40" height="2" rx="1" fill="url(#logoGrad3)" opacity="0.6" />
        
        {/* TURİZM DANIŞMANLIK */}
        <text
          fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
          fontSize="8.5"
          fontWeight="500"
          letterSpacing="3.5"
          fill="#94a3b8"
          y="40"
        >
          TURİZM DANIŞMANLIK
        </text>
      </g>
    </svg>
  );
}
