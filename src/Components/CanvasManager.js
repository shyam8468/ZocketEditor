



export default class CanvasManager {
  constructor(canvas, templateData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.templateData = templateData;
    this.image = null;
    this.init();
  }

  init() {
    this.render();
  }

  setImage(image) {
    this.image = image;
    this.render();
  }

  setText(type, text) {
    this.templateData[type].text = text;
    this.render();
  }

  setBackgroundColor(color) {
    this.templateData.backgroundColor = color;
    this.render();
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = this.ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  render() {
    const { ctx, canvas, templateData } = this;
    const { backgroundColor, urls } = templateData;
  
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw background color
    ctx.fillStyle = backgroundColor || '#0369A1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw design pattern
    const patternImage = new Image();
    patternImage.crossOrigin = "anonymous"; // Add this line to handle cross-origin issues
    patternImage.src = `${urls.design_pattern}?random=${Math.random()}`;
    patternImage.onload = () => {
      ctx.drawImage(patternImage, 0, 0, canvas.width, canvas.height);
      this.drawMask(); // Move this line here
    };
  }

  drawMask() {
    const { ctx, templateData } = this;
    const { image_mask, urls } = templateData;

    const maskImage = new Image();
    maskImage.src = `${urls.mask}?random=${Math.random()}`;
    maskImage.onload = () => {
      ctx.drawImage(maskImage, image_mask.x, image_mask.y, image_mask.width, image_mask.height);

      if (this.image) {
        this.applyMask();
      } else {
        this.drawMaskStroke();
      }
    };
  }

  applyMask() {
    const { ctx, templateData, image } = this;
    const { image_mask } = templateData;

    const maskAspectRatio = image_mask.width / image_mask.height;
    const imageAspectRatio = image.width / image.height;

    let drawWidth, drawHeight;
    let offsetX = image_mask.x, offsetY = image_mask.y;

    if (imageAspectRatio > maskAspectRatio) {
      // Image is wider than the mask
      drawWidth = image_mask.width;
      drawHeight = drawWidth / imageAspectRatio;
      offsetY += (image_mask.height - drawHeight) / 2;
    } else {
      // Image is taller than the mask
      drawHeight = image_mask.height;
      drawWidth = drawHeight * imageAspectRatio;
      offsetX += (image_mask.width - drawWidth) / 2;
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(image_mask.x, image_mask.y, image_mask.width, image_mask.height);
    ctx.clip();
    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();

    this.drawMaskStroke();
  }

  drawMaskStroke() {
    const { ctx, templateData } = this;
    const { image_mask, urls } = templateData;

    const maskStrokeImage = new Image();
    maskStrokeImage.src = `${urls.stroke}?random=${Math.random()}`;
    maskStrokeImage.onload = () => {
      ctx.drawImage(maskStrokeImage, image_mask.x, image_mask.y, image_mask.width, image_mask.height);
      this.drawText();
    };
  }

  drawText() {
    const { ctx, templateData } = this;
    const { caption, cta } = templateData;

    // Draw caption text
    ctx.fillStyle = caption.text_color;
    ctx.font = `${caption.font_size}px Arial`;
    ctx.textAlign = caption.alignment;
    ctx.backgroundColor = "#FFFFFF";
    const maxWidth = 1080 - caption.position.x * 2; // Calculate max width for text wrapping
    const lines = this.wrapText(caption.text, maxWidth);
    lines.forEach((line, i) => {
      ctx.fillText(line, caption.position.x, caption.position.y + (i * caption.font_size));
    });

    // Draw CTA text
    const ctaPadding = 24;
    ctx.fillStyle = cta.background_color;
    const ctaTextWidth = ctx.measureText(cta.text).width;
    const ctaX = cta.position.x - ctaPadding / 2;
    const ctaY = cta.position.y - cta.font_size;
    const ctaWidth = ctaTextWidth + ctaPadding;
    const ctaHeight = cta.font_size + ctaPadding / 2;

    ctx.fillRect(ctaX, ctaY, ctaWidth, ctaHeight);

    ctx.fillStyle = cta.text_color;
    ctx.font = `30px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cta.text, cta.position.x + ctaTextWidth / 2 - ctaPadding / 2, cta.position.y);
  }
}
