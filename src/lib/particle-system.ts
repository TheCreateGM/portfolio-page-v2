// src/lib/particle-system.ts

type Theme = 'light' | 'dark';

// The Particle class remains largely the same, but we'll type it.
class Particle {
    system: ParticleSystem;
    x: number;
    y: number;
    radius: number;
    color: string;
    alpha: number;
    life: number;
    maxLife: number;
    vx: number;
    vy: number;

    constructor(system: ParticleSystem) {
        this.system = system;
        this.x = Math.random() * system.width;
        this.y = Math.random() * system.height;
        this.radius = 0;
        this.color = '';
        this.alpha = 0;
        this.life = 0;
        this.maxLife = 0;
        this.vx = 0;
        this.vy = 0;
        this.reset();
    }

    reset(): void {
        this.x = Math.random() * this.system.width;
        this.y = Math.random() * this.system.height;
        this.radius = Math.random() * 2 + 1;

        const colors = this.system.getThemeColors();
        const saturation = this.system.isDarkMode ? 70 : 50;
        this.color = `hsl(${Math.random() * 360}, ${saturation}%, ${colors.particleLightness})`;
        this.alpha = 0;
        this.life = 0;
        this.maxLife = Math.random() * 60 + 120;

        const velocityScale = Math.min(this.system.width, this.system.height) / 1000;
        this.vx = (Math.random() - 0.5) * 0.5 * velocityScale;
        this.vy = (Math.random() - 0.5) * 0.5 * velocityScale;
    }

    update(): void {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = this.system.width;
        if (this.x > this.system.width) this.x = 0;
        if (this.y < 0) this.y = this.system.height;
        if (this.y > this.system.height) this.y = 0;

        this.life++;

        const maxAlpha = this.system.isDarkMode ? 0.8 : 0.5;
        if (this.life < this.maxLife / 4) {
            this.alpha = (this.life / (this.maxLife / 4)) * maxAlpha + 0.2;
        } else if (this.life > (this.maxLife * 3) / 4) {
            this.alpha = (1 - (this.life - (this.maxLife * 3) / 4) / (this.maxLife / 4)) * maxAlpha + 0.2;
        } else {
            this.alpha = maxAlpha;
        }

        if (this.life > this.maxLife) {
            this.reset();
        }
    }

    draw(): void {
        if (!this.system.ctx) return;
        const ctx = this.system.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        ctx.shadowBlur = this.radius * 3;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
    }
}

export class ParticleSystem {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    particles: Particle[];
    animationId: number | null;
    isDarkMode: boolean;
    width: number;
    height: number;
    numParticles: number;
    maxLineDistance: number;

    config = {
        particleDensity: 0.00008,
        baseMaxLineDistance: 120,
        maxLineDistanceScale: 0.8,
        minParticles: 50,
        maxParticles: 300,
    };

    constructor(canvas: HTMLCanvasElement, theme: Theme) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.animationId = null;
        this.isDarkMode = theme === 'dark';
        this.width = 0;
        this.height = 0;
        this.numParticles = 0;
        this.maxLineDistance = 0;

        this.initializeSystem();
    }

    initializeSystem(): void {
        this.updateDimensions();
        this.initParticles();
    }

    public handleResize(): void {
        this.updateDimensions();
        this.initParticles();
    }

    public updateTheme(newTheme: Theme): void {
        this.isDarkMode = newTheme === 'dark';
    }

    updateDimensions(): void {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        const screenArea = this.width * this.height;
        this.numParticles = Math.min(
            Math.max(
                Math.floor(screenArea * this.config.particleDensity),
                this.config.minParticles,
            ),
            this.config.maxParticles,
        );

        const screenDiagonal = Math.sqrt(this.width ** 2 + this.height ** 2);
        this.maxLineDistance = Math.min(
            this.config.baseMaxLineDistance * this.config.maxLineDistanceScale,
            screenDiagonal * 0.15,
        );
    }

    getThemeColors() {
        if (this.isDarkMode) {
            return {
                background: "rgba(10, 10, 10, 0)", // Make it transparent to see the real background
                particleLightness: "70%",
                lineLightness: "70%",
            };
        } else {
            return {
                background: "rgba(255, 255, 255, 0)", // Make it transparent
                particleLightness: "60%",
                lineLightness: "50%",
            };
        }
    }

    initParticles(): void {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    animate(): void {
        if (!this.ctx) return;
        const colors = this.getThemeColors();

        // This is a key change: we clear with a transparent color so the CSS background is visible.
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.numParticles; i++) {
            const p1 = this.particles[i];
            p1.update();
            p1.draw();

            for (let j = i + 1; j < this.numParticles; j++) {
                const p2 = this.particles[j];
                const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

                if (dist < this.maxLineDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);

                    const hueMatch = p1.color.match(/\d+/);
                    const hue = hueMatch ? hueMatch[0] : '0';
                    const saturation = this.isDarkMode ? 70 : 40;
                    const baseAlpha = this.isDarkMode ? 0.5 : 0.3;
                    const alpha = ((this.maxLineDistance - dist) / this.maxLineDistance) * baseAlpha;
                    this.ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${colors.lineLightness}, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start(): void {
        if (!this.animationId) {
            this.animate();
        }
    }

    stop(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}