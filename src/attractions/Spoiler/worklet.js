const scale = 1.0;

const rectDot = (ctx, x, y, size = 1.0, color = "#000") => {
  size *= scale;
  const l = 0.5 * size;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(x - l, y - l, size, size);
  ctx.closePath();
  ctx.fill();
};

const rand = (a, b) => a + (b - a) * Math.random();

const randWithPad = (max, pad) => {
  const r = max - 2.0 * pad;
  return pad + Math.random() * r;
};

registerPaint(
  "spoiler",
  class {
    static get inputProperties() {
      return ["--time"];
    }
    static get contextOptions() {
      return { alpha: true };
    }

    paint(ctx, size, props) {
      const particleCount = Math.floor(0.2 * size.width * size.height);

      for (let i = 0; i < particleCount; ++i) {
        rectDot(
          ctx,
          randWithPad(size.width, 0),
          rand(4, size.height),
          1,
          `rgba(0,0,0,${rand(0.0, 0.3)})`
        );
      }
    } // paint
  }
);
