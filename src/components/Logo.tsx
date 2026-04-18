export default function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Simple, clean icon — stylized compass pin */}
      <g transform="translate(2, 2)">
        <circle cx="20" cy="20" r="18" stroke="url(#grad)" strokeWidth="2.5" fill="none" />
        <path d="M20 6 L22 18 L20 16 L18 18 Z" fill="#6366f1" />
        <path d="M20 34 L18 22 L20 24 L22 22 Z" fill="#cbd5e1" />
        <circle cx="20" cy="20" r="3" fill="url(#grad)" />
      </g>

      {/* Clean text */}
      <text x="50" y="20" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="700" letterSpacing="1" fill="#1e293b">
        MERIJANS
      </text>
      <text x="50" y="34" fontFamily="system-ui, sans-serif" fontSize="7.5" fontWeight="500" letterSpacing="2.5" fill="#94a3b8">
        TURİZM DANIŞMANLIK
      </text>
    </svg>
  );
}
