

export interface GridOptions {
  gap?: number;
  pointSize?: number;
  color?: string;
  glowColor?: string;
  speed?: number;
  amplitude?: number;
  background?: string;
  perspective?: number;
  interactive?: boolean;
}

export class GridFX {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private points: GridPoint[] = [];
  private animationFrame = 0;
  private time = 0;

  private mouse = {
    x: -9999,
    y: -9999,
    radius: 120,
  };

  private options: Required<GridOptions> = {
    gap: 40,
    pointSize: 4,
    color: '#7df9ff',
    glowColor: 'rgba(125,249,255,0.8)',
    speed: 0.02,
    amplitude: 12,
    background: '#050816',
    perspective: 0.6,
    interactive: true,
  };

  constructor(canvas: HTMLCanvasElement, options?: GridOptions) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    this.canvas = canvas;
    this.ctx = ctx;

    this.options = {
      ...this.options,
      ...options,
    };

    this.resize();
    this.createGrid();
    this.attachEvents();
    this.animate();
  }

  private resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  private createGrid() {
    this.points = [];

    for (let y = 0; y <= this.height; y += this.options.gap) {
      for (let x = 0; x <= this.width; x += this.options.gap) {
        this.points.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: this.options.pointSize,
          offset: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  private attachEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createGrid();
    });

    if (this.options.interactive) {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });
    }
  }

  private updatePoints() {
    for (const point of this.points) {
      const wave = Math.sin(this.time + point.offset);

      point.y = point.baseY + wave * this.options.amplitude;

      if (this.options.interactive) {
        const dx = point.x - this.mouse.x;
        const dy = point.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;

          point.y -= force * 30;
        }
      }
    }
  }

  private drawBackground() {
    this.ctx.fillStyle = this.options.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawConnections() {
    const gap = this.options.gap;

    this.ctx.strokeStyle = 'rgba(125,249,255,0.12)';
    this.ctx.lineWidth = 1;

    for (const point of this.points) {
      const right = this.points.find(
        (p) =>
          p.baseX === point.baseX + gap &&
          p.baseY === point.baseY
      );

      const bottom = this.points.find(
        (p) =>
          p.baseX === point.baseX &&
          p.baseY === point.baseY + gap
      );

      if (right) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(right.x, right.y);
        this.ctx.stroke();
      }

      if (bottom) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(bottom.x, bottom.y);
        this.ctx.stroke();
      }
    }
  }

  private drawPoints() {
    for (const point of this.points) {
      const scale =
        1 +
        Math.sin(this.time + point.offset) * this.options.perspective;

      this.ctx.beginPath();
      this.ctx.arc(
        point.x,
        point.y,
        point.size * scale,
        0,
        Math.PI * 2
      );

      this.ctx.fillStyle = this.options.color;
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = this.options.glowColor;
      this.ctx.fill();
    }
  }

  private render() {
    this.drawBackground();
    this.updatePoints();
    this.drawConnections();
    this.drawPoints();
  }

  private animate = () => {
    this.time += this.options.speed;

    this.render();

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  public destroy() {
    cancelAnimationFrame(this.animationFrame);
  }
}
