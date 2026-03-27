import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "rain" | "star" | "glow";
}

interface Wave {
  offset: number;
  speed: number;
  amplitude: number;
  y: number;
}

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const startTime = performance.now();
    const SCENE1_DURATION = 3500;
    const SCENE2_DURATION = 3500;
    const SCENE3_START = SCENE1_DURATION + SCENE2_DURATION;
    const TOTAL_DURATION = 12000;

    const particles: Particle[] = [];

    const spawnRain = () => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * width,
          y: -10,
          vx: -0.5 + Math.random() * 0.3,
          vy: 8 + Math.random() * 4,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          size: 1 + Math.random(),
          type: "rain",
        });
      }
    };

    const spawnStars = () => {
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          vx: 0,
          vy: 0,
          life: Math.random() * 100,
          maxLife: 100,
          size: 0.5 + Math.random() * 1.5,
          type: "star",
        });
      }
    };

    const spawnGlowOrbs = () => {
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: width * 0.2 + Math.random() * width * 0.6,
          y: height * 0.3 + Math.random() * height * 0.3,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          life: 0,
          maxLife: 200,
          size: 30 + Math.random() * 50,
          type: "glow",
        });
      }
    };

    const waves: Wave[] = [
      { offset: 0, speed: 0.008, amplitude: 20, y: 0.68 },
      { offset: Math.PI / 3, speed: 0.012, amplitude: 14, y: 0.72 },
      { offset: Math.PI, speed: 0.006, amplitude: 25, y: 0.75 },
      { offset: Math.PI / 2, speed: 0.01, amplitude: 10, y: 0.78 },
    ];

    const waveColorsDark = [
      [10, 15, 35],
      [8, 12, 30],
      [6, 10, 25],
      [4, 8, 20],
    ];
    const waveColorsLight = [
      [5, 18, 50],
      [4, 15, 45],
      [3, 12, 40],
      [2, 10, 35],
    ];
    const waveColorsCyan = [
      [0, 40, 70],
      [0, 35, 65],
      [0, 30, 60],
      [0, 25, 55],
    ];

    spawnStars();

    const drawShip = (
      cx: number,
      cy: number,
      scale: number,
      opacity: number,
      modernProgress: number,
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      const mf = Math.max(0, Math.min(1, modernProgress));

      // Hull
      ctx.beginPath();
      if (mf < 0.5) {
        ctx.moveTo(-60, 0);
        ctx.quadraticCurveTo(-70, 20, -50, 30);
        ctx.lineTo(50, 30);
        ctx.quadraticCurveTo(75, 20, 65, 0);
        ctx.closePath();
      } else {
        const t = (mf - 0.5) * 2;
        ctx.moveTo(-70 + t * 10, 0);
        ctx.lineTo(-55 + t * 5, 25);
        ctx.lineTo(60 - t * 5, 25);
        ctx.lineTo(80 - t * 10, 0);
        ctx.closePath();
      }

      if (mf > 0.5) {
        const grad = ctx.createLinearGradient(-70, 0, 70, 30);
        grad.addColorStop(0, `rgba(0, 180, 220, ${0.6 + mf * 0.4})`);
        grad.addColorStop(0.5, "rgba(0, 212, 255, 0.8)");
        grad.addColorStop(1, "rgba(100, 200, 255, 0.6)");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#00D4FF";
        ctx.shadowBlur = 15 * mf;
      } else {
        ctx.fillStyle = `rgba(20, 25, 40, ${0.9 - mf * 0.3})`;
      }
      ctx.fill();

      if (mf < 0.8) {
        const sailOpacity = 1 - mf * 1.2;
        ctx.globalAlpha = opacity * Math.max(0, sailOpacity);

        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-5, -80);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(30, 35, 50, 0.9)";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(20, -55);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-5, -70);
        ctx.quadraticCurveTo(-30 + mf * 20, -40, -5, -5);
        ctx.quadraticCurveTo(5, -35, -5, -70);
        ctx.fillStyle = "rgba(40, 45, 65, 0.8)";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(20, -50);
        ctx.quadraticCurveTo(10, -30, 20, -10);
        ctx.quadraticCurveTo(30, -30, 20, -50);
        ctx.fillStyle = "rgba(45, 50, 70, 0.7)";
        ctx.fill();

        ctx.globalAlpha = opacity;
      }

      if (mf > 0.3) {
        const glowAlpha = (mf - 0.3) / 0.7;
        ctx.globalAlpha = opacity * glowAlpha;

        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-50 + i * 20, 5);
          ctx.lineTo(50 - i * 10, 5);
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 + i * 0.15})`;
          ctx.shadowColor = "#00D4FF";
          ctx.shadowBlur = 6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -40);
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.7 * glowAlpha})`;
        ctx.stroke();

        ctx.globalAlpha = opacity;
      }

      ctx.restore();
    };

    const drawUICard = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      progress: number,
      opacity: number,
    ) => {
      if (opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = opacity;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 10);
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 212, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (progress > 0) {
        ctx.beginPath();
        ctx.roundRect(x + 12, y + h - 16, (w - 24) * progress, 4, 2);
        const grad = ctx.createLinearGradient(
          x + 12,
          0,
          x + 12 + (w - 24) * progress,
          0,
        );
        grad.addColorStop(0, "rgba(0, 212, 255, 0.8)");
        grad.addColorStop(1, "rgba(100, 150, 255, 0.6)");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#00D4FF";
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = `${Math.floor(10 * (w / 160))}px sans-serif`;
      ctx.fillText(label, x + 12, y + 18);

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x + 20 + i * 22, y + h / 2 + 2, 5, 0, Math.PI * 2);
        ctx.strokeStyle =
          i === 0 ? "rgba(0, 212, 255, 0.9)" : "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (i === 0) {
          ctx.fillStyle = "rgba(0, 212, 255, 0.3)";
          ctx.fill();
        }
      }

      ctx.restore();
    };

    let frameCount = 0;

    const render = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      frameCount++;

      if (canvas.offsetWidth !== width || canvas.offsetHeight !== height) {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
      }

      const scene2Progress = Math.max(
        0,
        Math.min(1, (elapsed - SCENE1_DURATION) / SCENE2_DURATION),
      );
      const scene3Progress = Math.max(
        0,
        Math.min(1, (elapsed - SCENE3_START) / (TOTAL_DURATION - SCENE3_START)),
      );

      const easeInOut = (x: number) =>
        x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
      const s2e = easeInOut(scene2Progress);

      // Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      const baseR = Math.round(3 + s2e * 5 + scene3Progress * 3);
      const baseG = Math.round(5 + s2e * 7 + scene3Progress * 4);
      const baseB = Math.round(18 + s2e * 17 + scene3Progress * 5);
      bgGrad.addColorStop(0, `rgb(${baseR}, ${baseG}, ${baseB})`);
      bgGrad.addColorStop(1, `rgb(${baseR + 5}, ${baseG + 9}, ${baseB + 14})`);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Stars
      if (scene2Progress > 0.3) {
        const starOpacity = Math.min(1, (scene2Progress - 0.3) / 0.7);
        for (const p of particles.filter((p) => p.type === "star")) {
          p.life += 0.5;
          const twinkle = 0.4 + 0.6 * Math.sin(p.life * 0.05 + p.x);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * starOpacity * 0.8})`;
          ctx.fill();
        }
      }

      // Fog
      if (scene2Progress < 0.5) {
        const fogOpacity = (1 - scene2Progress * 2) * 0.3;
        const fogGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
        fogGrad.addColorStop(0, `rgba(20, 30, 60, ${fogOpacity * 0.8})`);
        fogGrad.addColorStop(0.5, `rgba(15, 20, 45, ${fogOpacity})`);
        fogGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Lightning
      if (scene2Progress < 0.2 && Math.random() < 0.002) {
        const lx = width * 0.2 + Math.random() * width * 0.6;
        const flash = ctx.createRadialGradient(lx, 0, 0, lx, 0, height * 0.4);
        flash.addColorStop(0, "rgba(200, 220, 255, 0.15)");
        flash.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = flash;
        ctx.fillRect(0, 0, width, height);
      }

      // Cyan ambient glow
      if (scene3Progress > 0) {
        const glowAlpha = scene3Progress * 0.12;
        const glowGrad = ctx.createRadialGradient(
          width / 2,
          height * 0.5,
          0,
          width / 2,
          height * 0.5,
          width * 0.5,
        );
        glowGrad.addColorStop(0, `rgba(0, 212, 255, ${glowAlpha})`);
        glowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Waves
      for (const [i, wave] of waves.entries()) {
        wave.offset += wave.speed * (scene2Progress > 0.5 ? 0.5 : 1);

        let r: number;
        let g: number;
        let b: number;
        const dark = waveColorsDark[i];
        const light = waveColorsLight[i];
        const cyan = waveColorsCyan[i];

        if (scene3Progress > 0) {
          const t3 = Math.min(1, scene3Progress * 2);
          r = Math.round(light[0] + (cyan[0] - light[0]) * t3);
          g = Math.round(light[1] + (cyan[1] - light[1]) * t3);
          b = Math.round(light[2] + (cyan[2] - light[2]) * t3);
        } else if (scene2Progress > 0) {
          r = Math.round(dark[0] + (light[0] - dark[0]) * s2e);
          g = Math.round(dark[1] + (light[1] - dark[1]) * s2e);
          b = Math.round(dark[2] + (light[2] - dark[2]) * s2e);
        } else {
          [r, g, b] = dark;
        }

        const waveY = height * wave.y;
        const amplitude =
          wave.amplitude *
          (scene2Progress > 0.5 ? 1 - (scene2Progress - 0.5) * 0.6 : 1);

        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= width; x += 5) {
          const y =
            waveY +
            Math.sin(x * 0.02 + wave.offset) * amplitude +
            Math.sin(x * 0.035 + wave.offset * 1.3) * amplitude * 0.5;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.9)`;
        ctx.fill();

        if (scene3Progress > 0.2) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 5) {
            const y =
              waveY +
              Math.sin(x * 0.02 + wave.offset) * amplitude +
              Math.sin(x * 0.035 + wave.offset * 1.3) * amplitude * 0.5;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(0, 212, 255, ${(scene3Progress - 0.2) * 0.15})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // Rain
      if (scene2Progress < 0.4 && frameCount % 2 === 0) {
        spawnRain();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (p.type !== "rain") continue;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const rainAlpha =
          Math.min(
            1 - lifeRatio,
            scene2Progress < 0.4 ? 1 : 1 - (scene2Progress - 0.4) / 0.6,
          ) * 0.4;
        if (rainAlpha > 0) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
          ctx.strokeStyle = `rgba(150, 180, 220, ${rainAlpha})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.stroke();
        }
        if (p.life >= p.maxLife || p.y > height) {
          particles.splice(i, 1);
        }
      }

      // Ship
      const shipX = width * 0.5 + Math.sin(elapsed * 0.0003) * width * 0.03;
      const shipY = height * 0.68 - 10 + Math.sin(elapsed * 0.001) * 5;
      const shipScale = Math.max(0.8, Math.min(1.5, width / 900));
      const shipOpacity =
        scene3Progress > 0.8 ? 1 - (scene3Progress - 0.8) * 5 : 1;

      if (shipOpacity > 0) {
        drawShip(shipX, shipY, shipScale, Math.max(0, shipOpacity), s2e);
      }

      // Scene 3 UI cards
      if (scene3Progress > 0.1 && width > 480) {
        const cardOpacity = Math.min(1, (scene3Progress - 0.1) / 0.4);
        const floatY = Math.sin(elapsed * 0.001) * 6;

        const cards = [
          {
            x: width * 0.05,
            y: height * 0.18 + floatY,
            w: 160,
            h: 55,
            label: "Learning Roadmap",
            prog: 0.7,
          },
          {
            x: width * 0.75,
            y: height * 0.22 - floatY,
            w: 150,
            h: 55,
            label: "Daily Actions",
            prog: 0.45,
          },
          {
            x: width * 0.08,
            y: height * 0.5 - floatY * 0.5,
            w: 140,
            h: 50,
            label: "Progress",
            prog: 0.6,
          },
          {
            x: width * 0.72,
            y: height * 0.48 + floatY * 0.5,
            w: 155,
            h: 55,
            label: "Curated Content",
            prog: 0.3,
          },
        ];

        for (const card of cards) {
          drawUICard(
            card.x,
            card.y,
            card.w,
            card.h,
            card.label,
            card.prog * scene3Progress,
            cardOpacity,
          );
        }
      }

      // Glow orbs
      if (scene3Progress > 0.3) {
        if (particles.filter((p) => p.type === "glow").length < 5) {
          spawnGlowOrbs();
        }
        particles;
        for (const p of particles.filter((p) => p.type === "glow")) {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          const orbAlpha = Math.min((scene3Progress - 0.3) / 0.5, 1) * 0.08;
          const gGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gGrad.addColorStop(0, `rgba(0, 212, 255, ${orbAlpha})`);
          gGrad.addColorStop(1, "rgba(0, 212, 255, 0)");
          ctx.fillStyle = gGrad;
          ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        }
      }

      // Vignette
      const vigGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.3,
        width / 2,
        height / 2,
        height * 0.9,
      );
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, width, height);

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
};

export default HeroCanvas;
