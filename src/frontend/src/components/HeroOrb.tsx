// Pure CSS/SVG animated glowing ring orb
export default function HeroOrb() {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 480, height: 480 }}
    >
      {/* Ambient glow behind */}
      <div
        className="absolute rounded-full orb-glow"
        style={{
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(201,176,122,0.12) 0%, rgba(164,138,82,0.04) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Outer slow ring */}
      <div className="absolute orb-ring-3" style={{ width: 420, height: 420 }}>
        <svg
          viewBox="0 0 420 420"
          width="420"
          height="420"
          style={{ overflow: "visible" }}
          role="img"
          aria-label="Decorative orbital ring"
        >
          <ellipse
            cx="210"
            cy="210"
            rx="200"
            ry="80"
            fill="none"
            stroke="rgba(201,176,122,0.10)"
            strokeWidth="1"
            strokeDasharray="8 12"
          />
        </svg>
      </div>

      {/* Middle ring - tilted */}
      <div
        className="absolute orb-ring-2"
        style={{
          width: 380,
          height: 380,
          transform: "rotate(-30deg) rotateX(60deg)",
        }}
      >
        <svg
          viewBox="0 0 380 380"
          width="380"
          height="380"
          role="img"
          aria-label="Decorative middle ring"
        >
          <circle
            cx="190"
            cy="190"
            r="175"
            fill="none"
            stroke="rgba(164,138,82,0.20)"
            strokeWidth="1.5"
            strokeDasharray="3 6"
          />
          <circle cx="190" cy="15" r="3" fill="#C9B07A" opacity="0.8" />
          <circle cx="365" cy="190" r="2" fill="#A48A52" opacity="0.6" />
        </svg>
      </div>

      {/* Inner spinning ring */}
      <div className="absolute orb-ring-1" style={{ width: 300, height: 300 }}>
        <svg
          viewBox="0 0 300 300"
          width="300"
          height="300"
          role="img"
          aria-label="Decorative inner ring"
        >
          <defs>
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9B07A" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#A48A52" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C9B07A" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <circle
            cx="150"
            cy="150"
            r="138"
            fill="none"
            stroke="url(#ringGrad1)"
            strokeWidth="2"
          />
          <path
            d="M 150 12 A 138 138 0 0 1 262 88"
            fill="none"
            stroke="#E8D5A8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Core sphere */}
      <div
        className="absolute rounded-full orb-glow"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle at 35% 30%, #2D4040 0%, #0F1E20 40%, #07131C 100%)",
          boxShadow:
            "0 0 60px rgba(201,176,122,0.2), 0 0 120px rgba(164,138,82,0.08), inset 0 1px 1px rgba(255,255,255,0.08)",
          border: "1px solid rgba(201,176,122,0.25)",
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 60,
            top: 28,
            left: 30,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 2 === 0 ? 3 : 2,
            height: i % 2 === 0 ? 3 : 2,
            background: "#C9B07A",
            opacity: 0.4 + i * 0.1,
            top: `${20 + i * 15}%`,
            left: `${15 + i * 16}%`,
            animation: `orbFloat ${6 + i}s ease-in-out infinite`,
            animationDelay: `${-i * 1.2}s`,
          }}
        />
      ))}
    </div>
  );
}
