export default function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stylized M with compass/tourism element */}
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Compass-inspired icon */}
      <circle cx="22" cy="25" r="18" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" />
      <circle cx="22" cy="25" r="3" fill="url(#logoGrad)" />
      <path d="M22 7 L24 22 L22 20 L20 22 Z" fill="url(#logoGrad)" />
      <path d="M22 43 L20 28 L22 30 L24 28 Z" fill="#94a3b8" />
      <path d="M4 25 L19 23 L19 27 Z" fill="#94a3b8" />
      <path d="M40 25 L25 27 L25 23 Z" fill="url(#logoGrad)" />
      {/* Company name */}
      <text x="50" y="22" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="700" fill="url(#logoGrad)">
        MERIJANS
      </text>
      <text x="50" y="38" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="400" fill="#64748b" letterSpacing="2">
        TURİZM DANIŞMANLIK
      </text>
    </svg>
  );
}
