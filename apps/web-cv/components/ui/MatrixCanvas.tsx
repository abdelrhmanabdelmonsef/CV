'use client';

import { useEffect, useRef } from 'react';
import { useMatrix } from '../../contexts/MatrixContext';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-+*[]{}';
const FONT_SIZE = 14;

export default function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { matrixActive } = useMatrix();
  const dropsRef = useRef<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / FONT_SIZE);
      dropsRef.current = Array(columns).fill(1);
    };

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    canvas.style.opacity = matrixActive ? '0.12' : '0.04';

    if (!matrixActive) return;

    const draw = () => {
      ctx.fillStyle = 'rgba(6, 9, 14, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff88';
      ctx.font = `${FONT_SIZE}px monospace`;

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const text = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        ctx.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const columns = Math.floor(canvas.width / FONT_SIZE);
    dropsRef.current = Array(columns).fill(1);
    intervalRef.current = setInterval(draw, 35);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [matrixActive]);

  return <canvas id="matrix-canvas" ref={canvasRef} aria-hidden="true" />;
}
