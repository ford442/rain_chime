import React, { useRef, useEffect } from 'react';

interface RainOverlayProps {
    density: number;
}

const RainOverlay: React.FC<RainOverlayProps> = ({ density }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let drops: {x: number, y: number, length: number, speed: number}[] = [];

        // Re-initialize drops when density changes or resize happens
        const initDrops = () => {
             // Use clientWidth/Height to match container size
             const width = canvas.clientWidth;
             const height = canvas.clientHeight;

             canvas.width = width;
             canvas.height = height;

             // Density 1 = 50 drops, Density 10 = ~300 drops
             const count = 50 + (density * 25);
             drops = [];
             for(let i=0; i<count; i++) {
                 drops.push({
                     x: Math.random() * width,
                     y: Math.random() * height,
                     length: Math.random() * 15 + 10,
                     speed: Math.random() * 10 + 15 + (density)
                 });
             }
        };

        const resizeObserver = new ResizeObserver(() => {
            initDrops();
        });
        resizeObserver.observe(canvas);

        // Also call init immediately
        initDrops();

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Rain color with glow
            ctx.strokeStyle = 'rgba(200, 220, 255, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowColor = 'rgba(100, 200, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';

            drops.forEach(drop => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;
                // Loop rain
                if (drop.y > canvas.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [density]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-20 w-full h-full mix-blend-screen"
        />
    );
};

export default RainOverlay;
