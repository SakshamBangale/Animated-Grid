
  min?: number;
  max?: number;
  speed?: number;
  damping?: number;
}

export class ScaleAnimator {
  private value: number;
  private target: number;
  private velocity = 0;

  private options: Required<ScaleOptions> = {
    min: 0.8,
    max: 1.2,
    speed: 0.12,
    damping: 0.8,
  };

  constructor(options?: ScaleOptions) {
    this.options = {
      ...this.options,
      ...options,
    };

    this.value = 1;
    this.target = 1;
  }

  public setTarget(scale: number) {
    this.target = Math.max(
      this.options.min,
      Math.min(this.options.max, scale)
    );
  }

  public update() {
    const force = (this.target - this.value) * this.options.speed;

    this.velocity += force;
    this.velocity *= this.options.damping;

    this.value += this.velocity;

    return this.value;
  }

  public pulse(intensity = 0.15) {
    this.setTarget(1 + intensity);
  }

  public reset() {
    this.setTarget(1);
  }

  public getValue() {
    return this.value;
  }
}
