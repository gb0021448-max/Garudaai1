import React from "react";

interface GarudaLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export default function GarudaLogo({ className = "", size = 48, animate = true }: GarudaLogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} id="garuda-logo-wrapper">
      {animate && (
        <>
          <div 
            className="absolute rounded-full bg-amber-500/10 blur-2xl animate-pulse" 
            style={{ 
              width: `${size * 1.6}px`, 
              height: `${size * 1.6}px`, 
              animationDuration: "6s" 
            }} 
          />
          <div 
            className="absolute rounded-full bg-cyan-500/10 blur-2xl animate-pulse" 
            style={{ 
              width: `${size * 1.3}px`, 
              height: `${size * 1.3}px`, 
              animationDuration: "4s",
              animationDelay: "1s"
            }} 
          />
        </>
      )}
      
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${animate ? "hover:scale-110 active:scale-95 transition-all duration-300" : ""} drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]`}
        id="garuda-svg-mythology-tech-fusion"
      >
        <defs>
          <linearGradient id="sacred-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="40%" stopColor="#FFB300" />
            <stop offset="80%" stopColor="#FF6F00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>

          <linearGradient id="cyber-teal" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#006064" />
            <stop offset="30%" stopColor="#00ACC1" />
            <stop offset="70%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#E0F7FA" />
          </linearGradient>

          <linearGradient id="metallic-obsidian" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <radialGradient id="sacred-shield-glass" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1E1E38" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#0F0F1E" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#05050A" stopOpacity="1" />
          </radialGradient>

          <filter id="hyper-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path
          d="M60,10 L64,28 L82,20 L74,37 L92,38 L79,51 L95,60 L78,65 L87,83 L72,78 L71,96 L60,83 L49,96 L48,78 L33,83 L42,65 L25,60 L41,51 L28,38 L46,37 L38,20 L56,28 Z"
          fill="none"
          stroke="url(#sacred-gold)"
          strokeWidth="1"
          strokeOpacity="0.25"
          className={animate ? "animate-spin" : ""}
          style={{ transformOrigin: "60px 60px", animationDuration: "60s" }}
        />

        <circle cx="60" cy="60" r="45" stroke="url(#sacred-gold)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="3 3" />
        <g className={animate ? "animate-spin" : ""} style={{ transformOrigin: "60px 60px", animationDuration: "25s" }}>
          <circle cx="60" cy="60" r="38" stroke="url(#cyber-teal)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="12 18" />
          <path d="M60 22 L60 98 M22 60 L98 60 M33 33 L87 87 M33 87 L87 33" stroke="url(#sacred-gold)" strokeWidth="0.5" strokeOpacity="0.15" />
        </g>

        <g className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <path
            d="M60 55 C40 50, 15 35, 5 22 C3 25, 2 35, 12 50 C20 60, 36 64, 45 66 C30 73, 10 78, 8 85 C30 84, 42 78, 50 72 Z"
            fill="url(#sacred-gold)"
            opacity="0.8"
          />
          <path
            d="M58 58 C42 54, 22 44, 14 34 C12 37, 10 46, 20 58 C28 66, 40 68, 48 70 C36 76, 22 83, 20 89 C38 86, 46 80, 52 74 Z"
            fill="url(#cyber-teal)"
            opacity="0.9"
          />
          <path
            d="M56 61 C44 58, 28 51, 23 44 C21 46, 20 52, 28 62 C34 69, 44 71, 50 72 C42 77, 32 84, 30 89 C43 85, 48 80, 53 75 Z"
            fill="url(#metallic-obsidian)"
            stroke="url(#sacred-gold)"
            strokeWidth="0.75"
          />
        </g>

        <g className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
          <path
            d="M60 55 C80 50, 105 35, 115 22 C117 25, 118 35, 108 50 C100 60, 84 64, 75 66 C90 73, 110 78, 112 85 C90 84, 78 78, 70 72 Z"
            fill="url(#sacred-gold)"
            opacity="0.8"
          />
          <path
            d="M62 58 C78 54, 98 44, 106 34 C108 37, 110 46, 100 58 C92 66, 80 68, 72 70 C84 76, 98 83, 100 89 C82 86, 74 80, 68 74 Z"
            fill="url(#cyber-teal)"
            opacity="0.9"
          />
          <path
            d="M64 61 C76 58, 92 51, 97 44 C99 46, 100 52, 92 62 C86 69, 76 71, 70 72 C78 77, 88 84, 90 89 C77 85, 72 80, 67 75 Z"
            fill="url(#metallic-obsidian)"
            stroke="url(#sacred-gold)"
            strokeWidth="0.75"
          />
        </g>

        <path
          d="M60,18 L96,38 L96,78 L60,102 L24,78 L24,38 Z"
          fill="url(#sacred-shield-glass)"
          stroke="url(#sacred-gold)"
          strokeWidth="2"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
        />

        <path
          d="M60,23 L91,41 L91,75 L60,96 L29,75 L29,41 Z"
          fill="none"
          stroke="url(#cyber-teal)"
          strokeWidth="1"
          strokeOpacity="0.6"
          strokeDasharray="6 4"
        />

        <path
          d="M60,23 V40 M29,41 L45,50 M91,41 L75,50 M29,75 L45,66 M91,75 L75,66 M60,96 V80"
          stroke="url(#cyber-teal)"
          strokeWidth="0.75"
          strokeOpacity="0.4"
        />

        <g className="drop-shadow-[0_0_8px_rgba(255,179,0,0.8)]">
          <path d="M46 32 C46 32, 50 30, 60 30 C70 30, 74 32, 74 32 L78 22 L60 25 L42 22 Z" fill="url(#sacred-gold)" />
          <path d="M50 25 C50 25, 54 24, 60 24 C66 24, 70 25, 70 25 L73 16 L60 19 L47 16 Z" fill="url(#sacred-gold)" />
          <path d="M56 16 L60 3 L64 16 L60 12 Z" fill="url(#sacred-gold)" />
          
          <circle cx="60" cy="3" r="1.5" fill="#00E5FF" filter="url(#hyper-glow)" />
          <circle cx="47" cy="16" r="1" fill="#00E5FF" />
          <circle cx="73" cy="16" r="1" fill="#00E5FF" />
          <circle cx="42" cy="22" r="1.2" fill="#00E5FF" />
          <circle cx="78" cy="22" r="1.2" fill="#00E5FF" />
        </g>

        <g className="drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          <path
            d="M60 32 L51 45 L60 62 Z"
            fill="url(#sacred-gold)"
            opacity="0.85"
          />
          <path
            d="M60 32 L69 45 L60 62 Z"
            fill="url(#sacred-gold)"
          />
          <line x1="60" y1="32" x2="60" y2="62" stroke="#FFF9C4" strokeWidth="0.75" />

          <polygon 
            points="54,43 45,39 52,38" 
            fill="#00E5FF" 
            filter="url(#hyper-glow)" 
          />
          <polygon 
            points="66,43 75,39 68,38" 
            fill="#00E5FF" 
            filter="url(#hyper-glow)" 
          />
        </g>

        <g>
          <circle 
            cx="60" 
            cy="52" 
            r="8" 
            fill="none" 
            stroke="url(#cyber-teal)" 
            strokeWidth="1.5"
            strokeOpacity="0.8"
            className={animate ? "animate-pulse" : ""} 
            style={{ transformOrigin: "60px 52px", animationDuration: "2s" }} 
          />
          
          <circle 
            cx="60" 
            cy="52" 
            r="4.5" 
            fill="#00E5FF" 
            filter="url(#hyper-glow)" 
          />
          <circle cx="60" cy="52" r="1.8" fill="#ffffff" />
        </g>

        <g stroke="url(#sacred-gold)" strokeWidth="1" strokeLinecap="round" opacity="0.85">
          <line x1="60" y1="102" x2="60" y2="114" />
          <circle cx="60" cy="114" r="1.5" fill="#FFB300" />
          
          <path d="M50 92 L38 108 H32" fill="none" strokeWidth="1" />
          <circle cx="32" cy="108" r="1.2" fill="#00E5FF" />
          
          <path d="M70 92 L82 108 H88" fill="none" strokeWidth="1" />
          <circle cx="88" cy="108" r="1.2" fill="#00E5FF" />
        </g>
      </svg>
    </div>
  );
          }
