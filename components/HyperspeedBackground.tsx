'use client';

import { useEffect, useRef } from 'react';
import './Hyperspeed.css';

export default function HyperspeedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for highway effect
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      color: string;
      speed: number;
    }> = [];

    const colors = {
      leftLanes: ['#3b82f6', '#6366f1', '#8b5cf6'], // Blue/indigo/purple
      rightLanes: ['#10b981', '#14b8a6', '#06b6d4'], // Green/teal/cyan
    };

    // Initialize particles
    for (let i = 0; i < 200; i++) {
      const isLeft = Math.random() > 0.5;
      particles.push({
        x: isLeft ? canvas.width * 0.3 : canvas.width * 0.7,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        color: isLeft
          ? colors.leftLanes[Math.floor(Math.random() * colors.leftLanes.length)]
          : colors.rightLanes[Math.floor(Math.random() * colors.rightLanes.length)],
        speed: 2 + Math.random() * 3,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        // Move particle
        particle.z -= particle.speed;

        // Reset if too close
        if (particle.z <= 0) {
          particle.z = 1000;
          particle.y = Math.random() * canvas.height;
        }

        // Calculate perspective
        const scale = 1000 / (1000 + particle.z);
        const x = (particle.x - canvas.width / 2) * scale + canvas.width / 2;
        const y = (particle.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = scale * 3;
        const opacity = Math.min(1, scale * 2);

        // Draw particle with glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Draw trail
        ctx.globalAlpha = opacity * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div id="hyperspeed-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
