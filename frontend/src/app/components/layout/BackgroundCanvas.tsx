import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas({ zIndex = -1, position = 'fixed' }: { zIndex?: number, position?: 'fixed' | 'absolute' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR at 2 for performance
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Lightweight floating packaging geometries
    const shapes = Array.from({ length: 32 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 40 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      vRotX: (Math.random() - 0.5) * 0.015,
      vRotY: (Math.random() - 0.5) * 0.015,
      vRotZ: (Math.random() - 0.5) * 0.015,
      type: Math.random() > 0.4 ? 'box' : 'dieline',
      depth: Math.random()
    }));

    let time = 0;

    const render = () => {
      time += 0.003;

      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft subtle ambient glow (Single batch)
      const cx2 = width * 0.8 + Math.cos(time * 0.8) * 100;
      const cy2 = height * 0.7 + Math.sin(time * 0.6) * 100;

      const grad = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 400);
      grad.addColorStop(0, 'rgba(99, 102, 241, 0.03)');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx2, cy2, 400, 0, Math.PI * 2);
      ctx.fill();

      // 2. Mouse interactive glow (white)
      if (mouseX > -500) {
        const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 250);
        mouseGrad.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
        mouseGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = mouseGrad;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 250, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Optimized floating 3D packaging boxes & dielines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'; // Technical wireframe look
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';

      shapes.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotX += shape.vRotX;
        shape.rotY += shape.vRotY;
        shape.rotZ += shape.vRotZ;

        if (shape.x < -100) shape.x = width + 100;
        if (shape.x > width + 100) shape.x = -100;
        if (shape.y < -100) shape.y = height + 100;
        if (shape.y > height + 100) shape.y = -100;

        const pX = (mouseX - width / 2) * shape.depth * 0.015;
        const pY = (mouseY - height / 2) * shape.depth * 0.015;

        ctx.save();
        ctx.translate(shape.x + pX, shape.y + pY);
        
        // Simple 3D Rotation helper
        const rotate = (p: number[], rx: number, ry: number, rz: number) => {
          let y1 = p[1]*Math.cos(rx) - p[2]*Math.sin(rx);
          let z1 = p[1]*Math.sin(rx) + p[2]*Math.cos(rx);
          let x2 = p[0]*Math.cos(ry) + z1*Math.sin(ry);
          let z2 = -p[0]*Math.sin(ry) + z1*Math.cos(ry);
          let x3 = x2*Math.cos(rz) - y1*Math.sin(rz);
          let y3 = x2*Math.sin(rz) + y1*Math.cos(rz);
          return [x3, y3, z2];
        };

        ctx.beginPath();

        if (shape.type === 'box') {
          // Render 3D Box Wireframe
          const w = shape.size * 0.5;
          const h = shape.size * 0.3; // Height is 60% of width
          const d = shape.size * 0.4; // Depth is 80% of width
          
          const vertices = [
            [-w, -h, -d], [ w, -h, -d], [ w,  h, -d], [-w,  h, -d],
            [-w, -h,  d], [ w, -h,  d], [ w,  h,  d], [-w,  h,  d]
          ];

          const pts = vertices.map(v => {
            const p = rotate(v, shape.rotX, shape.rotY, shape.rotZ);
            const pers = 400 / (400 + p[2]); 
            return { x: p[0] * pers, y: p[1] * pers };
          });

          const edges = [
            [0,1], [1,2], [2,3], [3,0], // back face
            [4,5], [5,6], [6,7], [7,4], // front face
            [0,4], [1,5], [2,6], [3,7]  // connecting edges
          ];

          edges.forEach(edge => {
            ctx.moveTo(pts[edge[0]].x, pts[edge[0]].y);
            ctx.lineTo(pts[edge[1]].x, pts[edge[1]].y);
          });
        } else {
          // Render 2D Flat Dieline Wireframe (rotating in 3D)
          const w = shape.size * 0.35;
          const h = shape.size * 0.35;
          const f = shape.size * 0.15; // flap size
          
          const dielineEdges = [
            // Center square
            [[-w, -h, 0], [w, -h, 0]], [[w, -h, 0], [w, h, 0]], [[w, h, 0], [-w, h, 0]], [[-w, h, 0], [-w, -h, 0]],
            // Top flap
            [[-w, -h, 0], [-w, -h-f, 0]], [[w, -h, 0], [w, -h-f, 0]], [[-w, -h-f, 0], [w, -h-f, 0]],
            // Bottom flap
            [[-w, h, 0], [-w, h+f, 0]], [[w, h, 0], [w, h+f, 0]], [[-w, h+f, 0], [w, h+f, 0]],
            // Left flap
            [[-w, -h, 0], [-w-f, -h, 0]], [[-w, h, 0], [-w-f, h, 0]], [[-w-f, -h, 0], [-w-f, h, 0]],
            // Right flap
            [[w, -h, 0], [w+f, -h, 0]], [[w, h, 0], [w+f, h, 0]], [[w+f, -h, 0], [w+f, h, 0]]
          ];

          dielineEdges.forEach(edge => {
            const p1 = rotate(edge[0], shape.rotX, shape.rotY, shape.rotZ);
            const p2 = rotate(edge[1], shape.rotX, shape.rotY, shape.rotZ);
            const pers1 = 400 / (400 + p1[2]);
            const pers2 = 400 / (400 + p2[2]);
            ctx.moveTo(p1[0]*pers1, p1[1]*pers1);
            ctx.lineTo(p2[0]*pers2, p2[1]*pers2);
          });
        }
        
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    />
  );
}
