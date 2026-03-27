import { useCallback, useEffect, useRef } from "react";

type Phase = "idle" | "holding" | "burst" | "subjects" | "fadeout" | "reform";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  saturation: number;
  lightness: number;
  type: "orb" | "streak" | "spark" | "ring";
  ringRadius?: number;
  ringExpand?: number;
}

interface SubjectCard {
  label: string;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angleSpeed: number;
  scale: number;
  opacity: number;
  targetOpacity: number;
  sinOffset: number;
  sinSpeed: number;
  sinAmp: number;
  hovered: boolean;
}

const SUBJECTS = [
  { label: "Mathematics", emoji: "∑" },
  { label: "Science", emoji: "⚗" },
  { label: "Design", emoji: "✦" },
  { label: "Programming", emoji: "⌨" },
  { label: "Philosophy", emoji: "◎" },
  { label: "Art", emoji: "◈" },
  { label: "Music", emoji: "♬" },
  { label: "Business", emoji: "◇" },
  { label: "History", emoji: "⌖" },
  { label: "Languages", emoji: "◉" },
  { label: "Psychology", emoji: "◑" },
  { label: "Engineering", emoji: "⚙" },
];

const InteractiveOrb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const holdStartRef = useRef<number>(0);
  const holdActiveRef = useRef(false);
  const frameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const subjectCardsRef = useRef<SubjectCard[]>([]);
  const phaseTimeRef = useRef<number>(0);
  const orbAngleRef = useRef(0);
  const jitterRef = useRef({ x: 0, y: 0 });
  const reformProgressRef = useRef(0);
  const burstDoneRef = useRef(false);
  const mouseRef = useRef({ x: -999, y: -999 });

  const spawnBurst = useCallback((cx: number, cy: number) => {
    const ps: Particle[] = [];
    // Large glowing orbs
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      const hue = 240 + Math.random() * 100; // indigo→violet
      ps.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 6 + Math.random() * 14,
        hue,
        saturation: 80 + Math.random() * 20,
        lightness: 55 + Math.random() * 20,
        type: "orb",
      });
    }
    // Gold orbs
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 10;
      ps.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 4 + Math.random() * 10,
        hue: 30 + Math.random() * 30,
        saturation: 90,
        lightness: 60 + Math.random() * 20,
        type: "orb",
      });
    }
    // Medium streaks
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 14;
      const hue = 200 + Math.random() * 160;
      ps.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        size: 2 + Math.random() * 5,
        hue,
        saturation: 70 + Math.random() * 30,
        lightness: 60 + Math.random() * 25,
        type: "streak",
      });
    }
    // Fine sparks
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 18;
      const hue = 260 + Math.random() * 80;
      ps.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 1,
        size: 0.5 + Math.random() * 2,
        hue,
        saturation: 85,
        lightness: 70 + Math.random() * 25,
        type: "spark",
      });
    }
    // Expanding rings
    for (let i = 0; i < 4; i++) {
      ps.push({
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        life: 1,
        maxLife: 1,
        size: 3,
        hue: 260 + i * 30,
        saturation: 80,
        lightness: 65,
        type: "ring",
        ringRadius: 0,
        ringExpand: 8 + i * 4,
      });
    }
    particlesRef.current = ps;
  }, []);

  const spawnSubjects = useCallback((w: number, h: number) => {
    const cards: SubjectCard[] = SUBJECTS.map((s, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const padX = w * 0.1;
      const padY = h * 0.12;
      const cellW = (w - padX * 2) / 4;
      const cellH = (h - padY * 2) / 3;
      return {
        label: s.label,
        emoji: s.emoji,
        x:
          padX +
          cellW * col +
          cellW * 0.5 +
          (Math.random() - 0.5) * cellW * 0.3,
        y:
          padY +
          cellH * row +
          cellH * 0.5 +
          (Math.random() - 0.5) * cellH * 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        angle: (Math.random() - 0.5) * 0.1,
        angleSpeed: (Math.random() - 0.5) * 0.001,
        scale: 0.6 + Math.random() * 0.6,
        opacity: 0,
        targetOpacity: 1,
        sinOffset: Math.random() * Math.PI * 2,
        sinSpeed: 0.4 + Math.random() * 0.6,
        sinAmp: 4 + Math.random() * 8,
        hovered: false,
      };
    });
    subjectCardsRef.current = cards;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();
    let subjectTimer = 0;

    const drawOrb = (t: number) => {
      const cx = W / 2;
      const cy = H / 2;
      const r = Math.min(W, H) * 0.22;
      const holdPct = holdActiveRef.current
        ? Math.min((performance.now() - holdStartRef.current) / 3000, 1)
        : 0;
      const heat = holdPct;
      const jx = jitterRef.current.x;
      const jy = jitterRef.current.y;

      // Outer glow rings
      for (let i = 3; i >= 0; i--) {
        const gr = ctx.createRadialGradient(
          cx + jx,
          cy + jy,
          r * 0.5,
          cx + jx,
          cy + jy,
          r * 1.5 + i * 20,
        );
        const alpha = (0.08 - i * 0.015) * (1 + heat);
        const hue = 250 - heat * 50;
        gr.addColorStop(0, `hsla(${hue},80%,65%,${alpha})`);
        gr.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.beginPath();
        ctx.arc(cx + jx, cy + jy, r * 1.5 + i * 22, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }

      // Revolving arc
      const trailCount = 8;
      for (let i = 0; i < trailCount; i++) {
        const frac = i / trailCount;
        const startAngle = orbAngleRef.current - Math.PI * 1.5 * frac;
        const endAngle =
          orbAngleRef.current - Math.PI * 1.5 * (frac + 1 / trailCount);
        const alpha = (1 - frac) * (0.9 - heat * 0.2);
        const hueShift = heat * 60;
        ctx.beginPath();
        ctx.arc(cx + jx, cy + jy, r, startAngle, endAngle, true);
        ctx.strokeStyle = `hsla(${255 + hueShift},75%,${60 + heat * 30}%,${alpha})`;
        ctx.lineWidth = 3 + (1 - frac) * 4;
        ctx.shadowBlur = 20 + heat * 30;
        ctx.shadowColor = `hsla(${255 + hueShift},80%,70%,0.9)`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Main ring
      ctx.beginPath();
      ctx.arc(cx + jx, cy + jy, r, 0, Math.PI * 2);
      const ringHue = 250 + heat * 80;
      ctx.strokeStyle = `hsla(${ringHue},70%,${65 + heat * 20}%,${0.5 + heat * 0.4})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(${ringHue},80%,70%,0.5)`;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner rings
      for (let ri = 1; ri <= 2; ri++) {
        ctx.beginPath();
        ctx.arc(cx + jx, cy + jy, r * (0.5 + ri * 0.15), 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(260,60%,70%,${0.08 + ri * 0.04})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Center core glow
      const coreG = ctx.createRadialGradient(
        cx + jx,
        cy + jy,
        0,
        cx + jx,
        cy + jy,
        r * 0.4,
      );
      coreG.addColorStop(
        0,
        `hsla(${270 - heat * 30},80%,${70 + heat * 20}%,${0.15 + heat * 0.3})`,
      );
      coreG.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.beginPath();
      ctx.arc(cx + jx, cy + jy, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = coreG;
      ctx.fill();

      // Orbiting particles
      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const a = orbAngleRef.current * 1.3 + (i / particleCount) * Math.PI * 2;
        const pr = r + Math.sin(t * 0.003 + i) * 8;
        const px = cx + Math.cos(a) * pr + jx;
        const py = cy + Math.sin(a) * pr + jy;
        const ps = 1.5 + Math.sin(t * 0.005 + i * 0.7) * 1;
        const ph = 240 + (i / particleCount) * 60 + heat * 40;
        ctx.beginPath();
        ctx.arc(px, py, ps, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${ph},80%,75%,0.9)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsla(${ph},80%,70%,0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Progress ring for hold
      if (holdPct > 0) {
        ctx.beginPath();
        ctx.arc(
          cx,
          cy,
          r + 14,
          -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * holdPct,
        );
        ctx.strokeStyle = `hsla(${40 + holdPct * 20},90%,60%,${0.5 + holdPct * 0.5})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(245,158,11,0.8)";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Revolving glowing dot on the ring
      const dotX = cx + jx + Math.cos(orbAngleRef.current) * r;
      const dotY = cy + jy + Math.sin(orbAngleRef.current) * r;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5 + heat * 4, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${260 + heat * 80},90%,${75 + heat * 15}%,1)`;
      ctx.shadowBlur = 30;
      ctx.shadowColor = `hsla(${260 + heat * 80},100%,80%,1)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawParticles = (dt: number) => {
      const cx = W / 2;
      const cy = H / 2;
      const ps = particlesRef.current;
      const alive: Particle[] = [];
      for (const p of ps) {
        // Decay
        const decayRate =
          p.type === "ring"
            ? 0.008
            : p.type === "orb"
              ? 0.012
              : p.type === "streak"
                ? 0.016
                : 0.02;
        p.life -= decayRate * (dt / 16.67);
        if (p.life <= 0) continue;
        alive.push(p);
        const alpha = p.life ** 1.4;

        if (p.type === "ring") {
          p.ringRadius =
            (p.ringRadius ?? 0) + (p.ringExpand ?? 6) * (dt / 16.67);
          const rr = p.ringRadius ?? 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${p.hue},${p.saturation}%,${p.lightness}%,${alpha * 0.7})`;
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 30;
          ctx.shadowColor = `hsla(${p.hue},80%,70%,${alpha * 0.5})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
          continue;
        }

        // Physics
        p.vy += 0.06 * (dt / 16.67); // gravity
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * (dt / 16.67);
        p.y += p.vy * (dt / 16.67);

        const color = `hsla(${p.hue},${p.saturation}%,${p.lightness}%,${alpha})`;

        if (p.type === "orb") {
          // Glow bloom: draw multiple times
          for (let layer = 3; layer >= 0; layer--) {
            const layerSize = p.size * (1 + layer * 1.2);
            const layerAlpha = alpha * (0.3 - layer * 0.06);
            ctx.beginPath();
            ctx.arc(p.x, p.y, layerSize, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},${p.saturation}%,${p.lightness}%,${layerAlpha})`;
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = 20;
          ctx.shadowColor = `hsla(${p.hue},90%,80%,${alpha})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (p.type === "streak") {
          const tailX = p.x - p.vx * 3;
          const tailY = p.y - p.vy * 3;
          const g = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
          g.addColorStop(
            0,
            `hsla(${p.hue},${p.saturation}%,${p.lightness}%,0)`,
          );
          g.addColorStop(1, color);
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = p.size;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsla(${p.hue},80%,70%,${alpha * 0.6})`;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else {
          // spark
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${p.hue},90%,80%,${alpha})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      particlesRef.current = alive;

      // Screen flash at burst start
      const burstAge = performance.now() - phaseTimeRef.current;
      if (burstAge < 200) {
        const flashAlpha = (1 - burstAge / 200) * 0.35;
        ctx.fillStyle = `rgba(180,160,255,${flashAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Shockwave
      if (burstAge < 600) {
        const swR = (burstAge / 600) * Math.min(W, H) * 0.8;
        const swA = (1 - burstAge / 600) * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, swR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(160,140,255,${swA})`;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 40;
        ctx.shadowColor = "rgba(140,120,255,0.8)";
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    const drawSubjectCard = (card: SubjectCard, t: number) => {
      const { x, y, angle, scale, opacity, label, emoji, hovered } = card;
      if (opacity <= 0.01) return;

      const cw = 140;
      const ch = 70;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      // Sinusoidal bob
      const bob =
        Math.sin(t * 0.001 * card.sinSpeed + card.sinOffset) * card.sinAmp;
      ctx.translate(0, bob);

      // Glass background
      ctx.beginPath();
      ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 14);
      const bg = ctx.createLinearGradient(0, -ch / 2, 0, ch / 2);
      bg.addColorStop(0, "rgba(30,25,60,0.85)");
      bg.addColorStop(1, "rgba(15,12,40,0.9)");
      ctx.fillStyle = bg;
      ctx.fill();

      // Glow border
      ctx.strokeStyle = hovered
        ? "rgba(180,160,255,0.9)"
        : "rgba(120,100,220,0.5)";
      ctx.lineWidth = hovered ? 1.8 : 1.2;
      ctx.shadowBlur = hovered ? 30 : 15;
      ctx.shadowColor = hovered
        ? "rgba(160,130,255,0.9)"
        : "rgba(100,80,200,0.6)";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Top shimmer
      ctx.beginPath();
      ctx.roundRect(-cw / 2, -ch / 2, cw, ch * 0.35, [14, 14, 0, 0]);
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fill();

      // Emoji
      ctx.font = `bold ${hovered ? 22 : 20}px serif`;
      ctx.fillStyle = hovered
        ? "rgba(200,180,255,1)"
        : "rgba(160,140,240,0.95)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(140,120,230,0.7)";
      ctx.fillText(emoji, 0, -10);
      ctx.shadowBlur = 0;

      // Label
      ctx.font = `${hovered ? 600 : 500} 11px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = hovered ? "rgba(240,235,255,1)" : "rgba(200,195,230,0.9)";
      ctx.shadowBlur = 0;
      ctx.fillText(label, 0, 14);

      ctx.restore();
    };

    const drawReformOrb = (progress: number) => {
      const cx = W / 2;
      const cy = H / 2;
      const r = Math.min(W, H) * 0.22;
      const p = Math.min(progress, 1);
      const sweep = p * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + sweep);
      ctx.strokeStyle = `hsla(255,75%,65%,${p})`;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(124,110,234,0.8)";
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const loop = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      const t = now;

      ctx.clearRect(0, 0, W, H);

      const phase = phaseRef.current;

      // Update orb rotation
      if (phase === "idle" || phase === "holding") {
        const speedMult = holdActiveRef.current
          ? 1 + Math.min((now - holdStartRef.current) / 3000, 1) * 3
          : 1;
        orbAngleRef.current += 0.025 * speedMult * (dt / 16.67);
      }

      // Update jitter
      if (phase === "holding" && holdActiveRef.current) {
        const elapsed = now - holdStartRef.current;
        const intensity = (elapsed / 3000) ** 2 * 18;
        jitterRef.current = {
          x: (Math.random() - 0.5) * intensity,
          y: (Math.random() - 0.5) * intensity,
        };
        // Check if hold complete
        if (elapsed >= 3000) {
          phaseRef.current = "burst";
          phaseTimeRef.current = now;
          burstDoneRef.current = false;
          holdActiveRef.current = false;
          jitterRef.current = { x: 0, y: 0 };
          spawnBurst(W / 2, H / 2);
          if (navigator.vibrate) navigator.vibrate([50, 30, 80, 30, 150]);
        }
      } else {
        jitterRef.current = { x: 0, y: 0 };
      }

      if (phase === "idle" || phase === "holding") {
        drawOrb(t);
      }

      if (phase === "burst") {
        drawParticles(dt);
        const allDead = particlesRef.current.length === 0;
        const burstAge = now - phaseTimeRef.current;
        if (allDead || burstAge > 2200) {
          phaseRef.current = "subjects";
          phaseTimeRef.current = now;
          subjectTimer = 0;
          spawnSubjects(W, H);
        }
      }

      if (phase === "subjects" || phase === "fadeout") {
        subjectTimer += dt;
        const cards = subjectCardsRef.current;
        for (const card of cards) {
          // Staggered fade in
          const cardIdx = SUBJECTS.findIndex((s) => s.label === card.label);
          const fadeDelay = cardIdx * 120;
          if (phase === "subjects") {
            if (subjectTimer > fadeDelay) {
              card.opacity = Math.min(card.opacity + 0.025 * (dt / 16.67), 1);
            }
          } else {
            card.opacity = Math.max(card.opacity - 0.015 * (dt / 16.67), 0);
          }
          // Drift
          card.x += card.vx * (dt / 16.67);
          card.y += card.vy * (dt / 16.67);
          card.angle += card.angleSpeed * (dt / 16.67);
          // Bounce
          const hw = 80;
          const hh = 45;
          if (card.x < hw) {
            card.x = hw;
            card.vx = Math.abs(card.vx);
          }
          if (card.x > W - hw) {
            card.x = W - hw;
            card.vx = -Math.abs(card.vx);
          }
          if (card.y < hh) {
            card.y = hh;
            card.vy = Math.abs(card.vy);
          }
          if (card.y > H - hh) {
            card.y = H - hh;
            card.vy = -Math.abs(card.vy);
          }

          // Hover
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          const dx = mx - card.x;
          const dy = my - card.y;
          card.hovered =
            Math.abs(dx) < 80 * card.scale && Math.abs(dy) < 44 * card.scale;

          drawSubjectCard(card, t);
        }

        if (phase === "subjects" && subjectTimer > 6000) {
          phaseRef.current = "fadeout";
        }
        if (phase === "fadeout") {
          const allGone = cards.every((c) => c.opacity <= 0.01);
          if (allGone) {
            phaseRef.current = "reform";
            phaseTimeRef.current = now;
            reformProgressRef.current = 0;
          }
        }
      }

      if (phase === "reform") {
        const reformAge = now - phaseTimeRef.current;
        reformProgressRef.current = reformAge / 1200;
        drawReformOrb(reformProgressRef.current);
        if (reformProgressRef.current >= 1) {
          phaseRef.current = "idle";
          holdActiveRef.current = false;
          orbAngleRef.current = 0;
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [spawnBurst, spawnSubjects]);

  // Input handlers
  const startHold = useCallback(() => {
    const phase = phaseRef.current;
    if (phase !== "idle") return;
    holdActiveRef.current = true;
    holdStartRef.current = performance.now();
    phaseRef.current = "holding";
  }, []);

  const endHold = useCallback(() => {
    if (phaseRef.current === "holding") {
      phaseRef.current = "idle";
      holdActiveRef.current = false;
    }
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const t = e.touches[0];
    mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer select-none touch-none"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        data-ocid="hero.canvas_target"
      />
      {/* Hold hint */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        style={{
          color: "rgba(160,150,220,0.55)",
          fontSize: "11px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Hold to activate
      </div>
    </div>
  );
};

export default InteractiveOrb;
