// ParticlesBackground — rich animated background with particles, orbs, and geometric shapes
import { useEffect, useRef } from "react";
import "./ParticlesBackground.css";

const BRAND = {
  teal:   { h: 195, s: 45, l: 40 },
  copper: { h: 28,  s: 55, l: 45 },
  sage:   { h: 160, s: 30, l: 55 },
  deep:   { h: 205, s: 40, l: 25 },
};

function randBrand() {
  const keys = Object.keys(BRAND);
  return BRAND[keys[Math.floor(Math.random() * keys.length)]];
}

export default function ParticlesBackground() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Particles ──────────────────────────────────────────────────────────
    const COUNT = 80;
    const particles = Array.from({ length: COUNT }, () => {
      const c = randBrand();
      return {
        x:     Math.random() * window.innerWidth,
        y:     Math.random() * window.innerHeight,
        z:     Math.random() * 700 + 100,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        vz:    (Math.random() - 0.5) * 0.5,
        h: c.h, s: c.s, l: c.l,
        // shape: 0 = circle, 1 = triangle, 2 = diamond
        shape: Math.floor(Math.random() * 3),
        pulse: Math.random() * Math.PI * 2, // phase offset for pulsing
      };
    });

    // ── Floating orbs ──────────────────────────────────────────────────────
    const ORBS = 6;
    const orbs = Array.from({ length: ORBS }, () => {
      const c = randBrand();
      return {
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        r:  Math.random() * 120 + 60,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        h: c.h, s: c.s, l: c.l,
        phase: Math.random() * Math.PI * 2,
      };
    });

    let frame = 0;
    const FL = 600;

    const drawTriangle = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawDiamond = (cx, cy, r) => {
      ctx.beginPath();
      ctx.moveTo(cx,     cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx,     cy + r);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
    };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cw = canvas.width;
      const ch = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Draw orbs (large soft glowing blobs) ──────────────────────────
      orbs.forEach(o => {
        o.phase += 0.008;
        const pulse = 1 + 0.12 * Math.sin(o.phase);
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * pulse);
        grad.addColorStop(0,   `hsla(${o.h},${o.s}%,${o.l}%,0.10)`);
        grad.addColorStop(0.5, `hsla(${o.h},${o.s}%,${o.l}%,0.05)`);
        grad.addColorStop(1,   `hsla(${o.h},${o.s}%,${o.l}%,0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -o.r)       o.x = cw + o.r;
        if (o.x > cw + o.r)   o.x = -o.r;
        if (o.y < -o.r)       o.y = ch + o.r;
        if (o.y > ch + o.r)   o.y = -o.r;
      });

      // ── Draw particles ─────────────────────────────────────────────────
      particles.sort((a, b) => b.z - a.z);

      particles.forEach(p => {
        p.pulse += 0.025;
        const scale  = FL / (FL + p.z);
        const sx     = cw / 2 + (p.x - cw / 2) * scale;
        const sy     = ch / 2 + (p.y - ch / 2) * scale;
        const r      = Math.max(0.8, (3.5 + 1.2 * Math.sin(p.pulse)) * scale);
        const alpha  = Math.min(0.65, scale * 0.75);

        // Mouse repulsion — particles gently drift away from cursor
        const dx = sx - mx;
        const dy = sy - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.6;
          p.vx += (dx / dist) * force * 0.04;
          p.vy += (dy / dist) * force * 0.04;
        }
        // Speed cap
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 1.2) { p.vx *= 0.95; p.vy *= 0.95; }

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(frame * 0.008 * (p.shape === 1 ? 1 : -0.5));

        const fillColor = `hsla(${p.h},${p.s}%,${p.l}%,${alpha.toFixed(2)})`;
        ctx.fillStyle   = fillColor;
        ctx.strokeStyle = `hsla(${p.h},${p.s}%,${p.l + 15}%,${(alpha * 0.6).toFixed(2)})`;
        ctx.lineWidth   = 0.6;

        if (p.shape === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 1) {
          drawTriangle(0, 0, r * 1.4);
          ctx.fill();
          ctx.stroke();
        } else {
          drawDiamond(0, 0, r * 1.2);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0)    p.x = cw;
        if (p.x > cw)   p.x = 0;
        if (p.y < 0)    p.y = ch;
        if (p.y > ch)   p.y = 0;
        if (p.z < 50)   p.z = 900;
        if (p.z > 900)  p.z = 50;
      });

      // ── Connecting lines between nearby particles ──────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i], pj = particles[j];
          const si = FL / (FL + pi.z);
          const sj = FL / (FL + pj.z);
          const xi = cw / 2 + (pi.x - cw / 2) * si;
          const yi = ch / 2 + (pi.y - ch / 2) * si;
          const xj = cw / 2 + (pj.x - cw / 2) * sj;
          const yj = ch / 2 + (pj.y - ch / 2) * sj;
          const d  = Math.hypot(xi - xj, yi - yj);
          if (d < 100) {
            const a = (0.15 * (1 - d / 100)).toFixed(3);
            ctx.beginPath();
            ctx.moveTo(xi, yi);
            ctx.lineTo(xj, yj);
            ctx.strokeStyle = `rgba(116,168,164,${a})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true"/>;
}
