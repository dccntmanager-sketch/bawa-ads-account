import React from 'react';

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const LogoBadge: React.FC<LogoBadgeProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  // Dimensions
  const dimensionMap = {
    sm: { box: 38, icon: 24, fontTitle: 'text-xs', fontSub: 'text-[9px]' },
    md: { box: 52, icon: 34, fontTitle: 'text-sm', fontSub: 'text-[10px]' },
    lg: { box: 84, icon: 56, fontTitle: 'text-lg', fontSub: 'text-xs' },
    xl: { box: 140, icon: 96, fontTitle: 'text-2xl', fontSub: 'text-sm' },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 3D Metallic Circular Emblem Badge */}
      <div
        className="relative flex items-center justify-center rounded-full shrink-0 select-none shadow-xl"
        style={{
          width: dim.box,
          height: dim.box,
        }}
      >
        {/* Outer glowing neon ring gradient border */}
        <div
          className="absolute inset-0 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-blue-600 to-fuchsia-500 shadow-lg shadow-blue-500/20"
        >
          {/* Inner dark gunmetal container with subtle metallic rim */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-[#0b0f19] flex items-center justify-center relative overflow-hidden border border-slate-800/80">
            {/* Specular sheen reflection */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-md pointer-events-none" />

            {/* Custom SVG Emblem matching the uploaded user image */}
            <svg
              viewBox="0 0 120 120"
              className="w-[82%] h-[82%] drop-shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="neonBarGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>

                <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>

                <linearGradient id="metallicMonitor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="40%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              {/* Monitor Bezel */}
              <rect
                x="24"
                y="30"
                width="72"
                height="46"
                rx="4"
                stroke="url(#metallicMonitor)"
                strokeWidth="3.5"
                fill="#0f172a"
                fillOpacity="0.8"
              />

              {/* Monitor Stand Base */}
              <path
                d="M52 76L48 84H72L68 76"
                stroke="url(#metallicMonitor)"
                strokeWidth="3"
                strokeLinejoin="round"
                fill="none"
              />
              <line
                x1="42"
                y1="85"
                x2="78"
                y2="85"
                stroke="url(#metallicMonitor)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Rising Growth Bar Charts inside Monitor */}
              {/* Bar 1 */}
              <rect x="36" y="60" width="8" height="11" rx="1.5" fill="#a855f7" />
              {/* Bar 2 */}
              <rect x="47" y="53" width="8" height="18" rx="1.5" fill="#8b5cf6" />
              {/* Bar 3 */}
              <rect x="58" y="45" width="8" height="26" rx="1.5" fill="#6366f1" />
              {/* Bar 4 */}
              <rect x="69" y="38" width="8" height="33" rx="1.5" fill="#06b6d4" />

              {/* Ascending Growth Arrow */}
              <path
                d="M32 64C46 58 62 48 86 31"
                stroke="url(#arrowGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Arrow Head */}
              <polygon
                points="88,27 75,32 83,41"
                fill="#38bdf8"
              />

              {/* Gear with User Silhouette (Account Manager) at Top-Left */}
              <g transform="translate(14, 18) scale(0.9)">
                {/* Gear circle / teeth */}
                <circle cx="16" cy="16" r="13" stroke="url(#gearGrad)" strokeWidth="2.5" fill="#1e293b" />
                {/* 6 gear cog teeth */}
                <rect x="14" y="1" width="4" height="4" rx="1" fill="#cbd5e1" />
                <rect x="14" y="27" width="4" height="4" rx="1" fill="#cbd5e1" />
                <rect x="1" y="14" width="4" height="4" rx="1" fill="#cbd5e1" />
                <rect x="27" y="14" width="4" height="4" rx="1" fill="#cbd5e1" />
                <rect x="5" y="5" width="3.5" height="3.5" rx="0.8" fill="#94a3b8" />
                <rect x="23.5" y="23.5" width="3.5" height="3.5" rx="0.8" fill="#94a3b8" />
                
                {/* User Avatar Silhouette inside Gear */}
                <circle cx="16" cy="13" r="4.5" fill="#c084fc" />
                <path
                  d="M10 23C10 19.5 12.8 18 16 18C19.2 18 22 19.5 22 23"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="#c084fc"
                  fillOpacity="0.4"
                />
              </g>

              {/* Outer circular neon accent indicator */}
              <circle
                cx="60"
                cy="60"
                r="56"
                stroke="url(#neonBarGrad)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Typography Branding matching "AD ACCOUNT MANAGER | MANAGE • OPTIMIZE • GROW" */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold tracking-tight text-white uppercase font-display text-base sm:text-lg">
              Ad Account
            </span>
            <span className="font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent uppercase font-display text-base sm:text-lg">
              Manager
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold tracking-widest text-cyan-400 uppercase">
              Manage
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase">
              Optimize
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-[10px] font-semibold tracking-widest text-purple-400 uppercase">
              Grow
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
