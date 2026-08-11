export interface ImageSettings {
  zoom: number;
  panX: number;
  panY: number;
}

export interface BuilderDetails {
  name: string;
  role: string;
  stack: string;
  location?: string;
  github?: string;
  twitter?: string;
  title: string;
}

// Draw the profile photo onto the canvas with user settings
export function drawUserImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  settings: ImageSettings
) {
  ctx.save();
  
  // Create clipping region for the image container
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  const imgWidth = img.width;
  const imgHeight = img.height;
  const imgAspect = imgWidth / imgHeight;
  const containerAspect = width / height;

  let drawWidth = width;
  let drawHeight = height;

  if (imgAspect > containerAspect) {
    drawWidth = height * imgAspect;
  } else {
    drawHeight = width / imgAspect;
  }

  // Apply zoom
  drawWidth *= settings.zoom;
  drawHeight *= settings.zoom;

  // Calculate centered position plus user pan offset
  const drawX = x + (width - drawWidth) / 2 + settings.panX;
  const drawY = y + (height - drawHeight) / 2 + settings.panY;

  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  
  ctx.restore();
}

// Helper to draw waves on the canvas bottom
function drawWaves(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, amplitude: number, waveCount: number) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);
  
  const step = w / 100;
  for (let i = 0; i <= 100; i++) {
    const x = i * step;
    const y = h - 60 + Math.sin((i / 100) * Math.PI * 2 * waveCount) * amplitude;
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Helper to draw a palm tree sticker/vector
function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Trunk
  ctx.beginPath();
  ctx.moveTo(0, 80);
  ctx.quadraticCurveTo(-15, 40, -5, 0);
  ctx.quadraticCurveTo(-18, 40, -5, 80);
  ctx.fill();

  // Leaves
  const angles = [-1.8, -1.2, -0.6, 0.6, 1.2, 1.8];
  angles.forEach(ang => {
    ctx.save();
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.quadraticCurveTo(20, -15, 40, -5);
    ctx.quadraticCurveTo(20, 5, -5, 0);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

// Draw a hand-drawn star
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#0a2e1d';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

// Draw PFP Frame
export function drawPfpFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  settings: ImageSettings,
  variantIndex: number = 0
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  if (!img) {
    ctx.fillStyle = '#0b4f30';
    ctx.fillRect(0, 0, w, h);
  } else {
    drawUserImage(ctx, img, 0, 0, w, h, settings);
  }

  ctx.save();

  const green = '#0b4f30';
  const cream = '#faf8f0';
  const yellow = '#fadb14';
  const pink = '#ff007f';
  const dark = '#0a2e1d';

  if (variantIndex === 0) {
    // GOA SUNSET POSTER FRAME
    ctx.strokeStyle = dark;
    ctx.lineWidth = 24;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.strokeStyle = green;
    ctx.lineWidth = 14;
    ctx.strokeRect(26, 26, w - 52, h - 52);

    // Sun in corner
    ctx.save();
    ctx.shadowColor = dark;
    ctx.shadowBlur = 8;
    ctx.fillStyle = yellow;
    ctx.beginPath();
    ctx.arc(w - 130, 130, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Waves bottom
    drawWaves(ctx, w, h, green, 10, 3);
    drawWaves(ctx, w, h, yellow, 7, 4);

    // Palm tree
    drawPalmTree(ctx, 110, h - 170, 1.3, cream);
    drawPalmTree(ctx, 105, h - 175, 1.3, dark);

    // Star sticker
    drawStar(ctx, w - 100, h - 140, 5, 25, 12, pink);

    // Goa stamp
    ctx.save();
    ctx.translate(125, 105);
    ctx.rotate(-0.08);
    ctx.fillStyle = pink;
    ctx.beginPath();
    ctx.roundRect(-60, -30, 120, 60, 10);
    ctx.fill();
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = cream;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('गोवा', 0, 0);
    ctx.restore();

    // Bottom Banner
    ctx.fillStyle = dark;
    ctx.fillRect(160, h - 70, w - 320, 44);
    ctx.font = '900 16px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HH GOA BUILDER 2026', w / 2, h - 48);

  } else if (variantIndex === 1) {
    // RETRO GREEN BORDER
    ctx.strokeStyle = dark;
    ctx.lineWidth = 26;
    ctx.strokeRect(13, 13, w - 26, h - 26);

    ctx.strokeStyle = cream;
    ctx.lineWidth = 8;
    ctx.strokeRect(29, 29, w - 58, h - 58);

    // Corner marks
    ctx.fillStyle = pink;
    ctx.fillRect(33, 33, 34, 34);
    ctx.fillRect(w - 67, 33, 34, 34);
    ctx.fillRect(33, h - 67, 34, 34);
    ctx.fillRect(w - 67, h - 67, 34, 34);

    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.strokeRect(33, 33, 34, 34);
    ctx.strokeRect(w - 67, 33, 34, 34);
    ctx.strokeRect(33, h - 67, 34, 34);
    ctx.strokeRect(w - 67, h - 67, 34, 34);

    // Banner
    ctx.fillStyle = yellow;
    ctx.fillRect(w / 2 - 200, 29, 400, 48);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.strokeRect(w / 2 - 200, 29, 400, 48);

    ctx.font = 'bold 20px serif';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BUILDER HOUSE GOA', w / 2, 53);

    drawWaves(ctx, w, h, pink, 8, 2);

    ctx.fillStyle = cream;
    ctx.fillRect(w / 2 - 180, h - 80, 360, 48);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.strokeRect(w / 2 - 180, h - 80, 360, 48);

    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = green;
    ctx.fillText('✦ OCT 28 - 31, 2026 ✦', w / 2, h - 56);

  } else {
    // COA BEACH STAMP
    ctx.strokeStyle = dark;
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Corner diagonals
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, 70); ctx.lineTo(70, 10);
    ctx.moveTo(w - 10, 70); ctx.lineTo(w - 80, 10);
    ctx.moveTo(10, h - 70); ctx.lineTo(70, h - 10);
    ctx.moveTo(w - 10, h - 70); ctx.lineTo(w - 80, h - 10);
    ctx.stroke();

    // Verification stamp
    ctx.save();
    ctx.translate(w - 140, h - 140);
    ctx.rotate(0.15);
    ctx.fillStyle = yellow;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = dark;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '900 14px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VERIFIED', 0, -16);
    ctx.font = '900 20px serif';
    ctx.fillText('BUILDER', 0, 10);
    ctx.restore();

    ctx.fillStyle = dark;
    ctx.fillRect(40, 40, 220, 40);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = cream;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HH GOA // 2026', 150, 60);
  }

  ctx.restore();
}

// Draw Builder ID Card
export function drawBuilderCard(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  imgSettings: ImageSettings,
  details: BuilderDetails,
  variantIndex: number = 0
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;  // 1080
  const h = canvas.height; // 1350

  ctx.clearRect(0, 0, w, h);

  const green = '#0b4f30';
  const dark = '#0a2e1d';
  const cream = '#faf8f0';
  const yellow = '#fadb14';
  const pink = '#ff007f';

  // 1. Base card
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = dark;
  ctx.lineWidth = 26;
  ctx.strokeRect(13, 13, w - 26, h - 26);

  // Light green dot pattern in background
  ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
  for (let x = 40; x < w - 40; x += 25) {
    for (let y = 40; y < h - 40; y += 25) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Main Event Header
  ctx.fillStyle = green;
  ctx.fillRect(26, 26, w - 52, 160);

  ctx.strokeStyle = yellow;
  ctx.lineWidth = 4;
  ctx.strokeRect(38, 38, w - 76, 136);

  // Official Logo Drawing: "HACKER HOUSE" with overlapping Devanagari "गोवा" badge
  ctx.font = 'bold 54px serif';
  ctx.fillStyle = yellow;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER', w / 2, 68);
  ctx.fillText('HOUSE', w / 2, 114);

  ctx.save();
  ctx.translate(w / 2, 91);
  ctx.rotate(-0.08);
  ctx.fillStyle = pink;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3.5;
  const logoBadgeW = 96;
  const logoBadgeH = 38;
  ctx.beginPath();
  ctx.roundRect(-logoBadgeW / 2, -logoBadgeH / 2, logoBadgeW, logoBadgeH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = yellow;
  ctx.fillText('गोवा', 0, 0);
  ctx.restore();

  // Draw event dates at the bottom of header box
  ctx.font = '900 13px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = cream;
  ctx.fillText('OCT 28-31, 2026', w / 2, 150);

  // 3. Profile Photo with Editorial Offset Framing
  const photoSize = 450;
  const photoX = w / 2 - photoSize / 2;
  const photoY = 230;

  // Offset paper-border (Yellow behind)
  ctx.save();
  ctx.fillStyle = yellow;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  ctx.fillRect(photoX - 10, photoY - 10, photoSize + 20, photoSize + 20);
  ctx.strokeRect(photoX - 10, photoY - 10, photoSize + 20, photoSize + 20);
  ctx.restore();

  // Photo background/base
  ctx.fillStyle = dark;
  ctx.fillRect(photoX, photoY, photoSize, photoSize);

  if (img) {
    drawUserImage(ctx, img, photoX, photoY, photoSize, photoSize, imgSettings);
  } else {
    ctx.fillStyle = '#c5d1c9';
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
    ctx.font = 'bold 32px serif';
    ctx.fillStyle = green;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BUILDER HOUSE', w / 2, photoY + photoSize / 2);
  }

  // Main Pink Border around photo
  ctx.strokeStyle = pink;
  ctx.lineWidth = 6;
  ctx.strokeRect(photoX, photoY, photoSize, photoSize);

  // Star and palm tree stickers around photo
  drawStar(ctx, photoX - 25, photoY - 20, 5, 20, 10, pink);
  
  ctx.save();
  ctx.translate(photoX + photoSize - 20, photoY - 20);
  ctx.fillStyle = yellow;
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  drawPalmTree(ctx, 0, -18, 0.45, dark);
  ctx.restore();

  // 4. Primary Content: Name & Title (CONFIDENT EDITORIAL HIERARCHY)
  const contentY = 730;

  // Category Stamp
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = pink;
  ctx.textAlign = 'center';
  ctx.fillText('✦ HH GOA BUILDER PASS ✦', w / 2, contentY);

  // Name (Oversized, dominant with dynamic fitting)
  const displayName = (details.name || 'YOUR NAME').toUpperCase();
  let nameFontSize = 74;
  if (displayName.length > 20) {
    nameFontSize = 46;
  } else if (displayName.length > 15) {
    nameFontSize = 58;
  }
  ctx.font = `bold ${nameFontSize}px serif`;
  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  ctx.fillText(displayName, w / 2, contentY + 75);

  // Builder Title (Secondary, medium-large)
  const displayTitle = (details.title || 'BUILDER TITLE').toUpperCase();
  let titleFontSize = 30;
  if (displayTitle.length > 25) {
    titleFontSize = 22;
  }
  ctx.font = `bold ${titleFontSize}px monospace`;
  ctx.fillStyle = green;
  ctx.textAlign = 'center';
  ctx.fillText(displayTitle, w / 2, contentY + 135);

  // Separator Line
  const metaY = contentY + 190;
  ctx.strokeStyle = 'rgba(10, 46, 29, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(180, metaY);
  ctx.lineTo(w - 180, metaY);
  ctx.stroke();

  // Spaced metadata columns (Clean two-row, two-column hierarchy layout)
  const roleVal = (details.role || 'BUILDER').toUpperCase();
  const stackVal = (details.stack || 'GENERAL').toUpperCase();
  const locVal = (details.location || 'GOA HOUSE').toUpperCase();
  const twitterVal = (details.twitter || '@HHGOA').trim().toUpperCase();

  const colLeftX = 220;
  const colRightX = w - 220;
  
  ctx.textBaseline = 'top';

  // ROW 1: STACK (Left) & ROLE (Right)
  // Stack
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = pink;
  ctx.textAlign = 'left';
  ctx.fillText('STACK', colLeftX, metaY + 20);
  ctx.font = 'bold 26px serif';
  ctx.fillStyle = dark;
  ctx.fillText(stackVal, colLeftX, metaY + 44);

  // Role
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = pink;
  ctx.textAlign = 'right';
  ctx.fillText('ROLE', colRightX, metaY + 20);
  ctx.font = 'bold 26px serif';
  ctx.fillStyle = dark;
  ctx.fillText(roleVal, colRightX, metaY + 44);

  // ROW 2: LOCATION (Left) & HANDLE (Right)
  const row2Y = metaY + 105;

  // Location
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = pink;
  ctx.textAlign = 'left';
  ctx.fillText('LOCATION', colLeftX, row2Y);
  ctx.font = 'bold 26px serif';
  ctx.fillStyle = dark;
  ctx.fillText(locVal, colLeftX, row2Y + 24);

  // Handle
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = pink;
  ctx.textAlign = 'right';
  ctx.fillText('HANDLE', colRightX, row2Y);
  ctx.font = 'bold 26px serif';
  ctx.fillStyle = dark;
  ctx.fillText(twitterVal, colRightX, row2Y + 24);

  // Bottom separator line
  ctx.strokeStyle = 'rgba(10, 46, 29, 0.15)';
  ctx.beginPath();
  ctx.moveTo(180, row2Y + 70);
  ctx.lineTo(w - 180, row2Y + 70);
  ctx.stroke();

  // 6. GOA READY Stamp (Jagged Circle outline, stamped on card - highly legible)
  ctx.save();
  ctx.translate(w - 240, contentY + 95);
  ctx.rotate(-0.12);
  
  // Outer circle with small tabs for stamp look
  ctx.fillStyle = pink;
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.strokeStyle = cream;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 60, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = '900 18px monospace';
  ctx.fillStyle = cream;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GOA', 0, -18);
  ctx.font = 'bold 28px serif';
  ctx.fillText('READY', 0, 10);
  ctx.restore();

  // 7. Barcode & Serial Footer
  const barcodeY = h - 140;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  let cursorX = w / 2 - 250;
  const barcodeHeight = 56;
  const pattern = [2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 2, 4, 8, 2, 4, 2, 6, 8, 2, 4, 8, 2, 4, 6, 2];
  for (let i = 0; i < pattern.length; i++) {
    const width = pattern[i];
    ctx.fillStyle = i % 2 === 0 ? dark : 'rgba(0,0,0,0)';
    if (i % 2 === 0) {
      ctx.fillRect(cursorX, barcodeY, width, barcodeHeight);
    }
    cursorX += width;
  }

  // Serial Text
  ctx.font = '15px monospace';
  ctx.fillStyle = green;
  ctx.textAlign = 'center';
  const nameCode = details.name ? details.name.substring(0, 3).toUpperCase().padEnd(3, 'X') : 'HCK';
  const nameSum = (details.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const serialNo = String(1000 + (nameSum % 9000)).padStart(4, '0');
  ctx.fillText(`HH26 • GOA • ${nameCode} • ${serialNo}`, w / 2, barcodeY + 80);

  ctx.restore();
}

// Preload all crew member images
export async function preloadCrewImages(members: any[]): Promise<Record<string, HTMLImageElement>> {
  const preloaded: Record<string, HTMLImageElement> = {};
  
  const promises = members.map(m => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = m.photo;
      img.onload = () => {
        preloaded[m.id] = img;
        resolve();
      };
      img.onerror = () => {
        // Fallback or skip
        resolve();
      };
    });
  });
  
  await Promise.all(promises);
  return preloaded;
}

// Get standard layout box for member index (Card layout - 1080x1080 square)
function getMemberLayoutCard(count: number, idx: number): { x: number; y: number; w: number; h: number } {
  if (count === 1) {
    // 1 member: center square
    return {
      x: 390,
      y: 350,
      w: 300,
      h: 360,
    };
  } else if (count === 2) {
    // 2 members: side by side
    return {
      x: idx === 0 ? 180 : 580,
      y: 350,
      w: 320,
      h: 360,
    };
  } else {
    // 3 members: Pyramid layout
    if (idx === 0) {
      // Top Center
      return {
        x: 390,
        y: 330,
        w: 300,
        h: 185,
      };
    } else {
      // Bottom Left & Right
      return {
        x: idx === 1 ? 180 : 580,
        y: 535,
        w: 320,
        h: 185,
      };
    }
  }
}

// Get standard layout box for member index (Poster layout - 1080x1350 portrait)
function getMemberLayoutPoster(count: number, idx: number): { x: number; y: number; w: number; h: number } {
  if (count === 1) {
    // 1 member: center vertical frame
    return {
      x: 315,
      y: 380,
      w: 450,
      h: 500,
    };
  } else if (count === 2) {
    // 2 members: side by side vertical
    return {
      x: idx === 0 ? 100 : 580,
      y: 380,
      w: 400,
      h: 500,
    };
  } else {
    // 3 members: pyramid composition
    if (idx === 0) {
      // Top center
      return {
        x: 340,
        y: 340,
        w: 400,
        h: 260,
      };
    } else {
      // Bottom left and right
      return {
        x: idx === 1 ? 100 : 580,
        y: 630,
        w: 400,
        h: 260,
      };
    }
  }
}

// Draw Crew pass/ID card (Cream background, 1080x1080 square)
export function drawCrewCard(
  canvas: HTMLCanvasElement,
  crew: any,
  images: Record<string, HTMLImageElement>,
  variantIndex: number = 0
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;  // 1080
  const h = canvas.height; // 1080

  ctx.clearRect(0, 0, w, h);

  const green = '#0b4f30';
  const dark = '#0a2e1d';
  const cream = '#faf8f0';
  const yellow = '#fadb14';
  const pink = '#ff007f';

  // 1. Draw Background Base
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = dark;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Light green dot pattern in background
  ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
  for (let x = 30; x < w - 30; x += 22) {
    for (let y = 30; y < h - 30; y += 22) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 2. Main Event Header
  ctx.fillStyle = green;
  ctx.fillRect(20, 20, w - 40, 130);

  ctx.strokeStyle = yellow;
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, w - 60, 110);

  // Official Logo Layout
  ctx.font = 'bold 46px serif';
  ctx.fillStyle = yellow;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER', w / 2, 56);
  ctx.fillText('HOUSE', w / 2, 96);

  ctx.save();
  ctx.translate(w / 2, 76);
  ctx.rotate(-0.08);
  ctx.fillStyle = pink;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3;
  const ccBadgeW = 76;
  const ccBadgeH = 30;
  ctx.beginPath();
  ctx.roundRect(-ccBadgeW / 2, -ccBadgeH / 2, ccBadgeW, ccBadgeH, 10);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = yellow;
  ctx.fillText('गोवा', 0, 0);
  ctx.restore();

  ctx.font = '900 12px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = cream;
  ctx.fillText('OCTOBER 2026', w / 2, 122);

  // 3. Crew Metadata Details
  const detailsY = 165;
  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = pink;
  ctx.textAlign = 'center';
  ctx.fillText(`✦ CREW PASS // CODE: ${crew.code} ✦`, w / 2, detailsY + 20);

  ctx.font = 'bold 44px serif';
  ctx.fillStyle = dark;
  ctx.fillText(crew.name.toUpperCase(), w / 2, detailsY + 65);

  // Crew Class Stamp (Subtle shift to the side or below)
  const classY = detailsY + 110;
  ctx.save();
  ctx.font = 'bold 18px monospace';
  const classText = (crew.generatedClass || 'THE GOA SHIPPERS').toUpperCase();
  const textWidth = ctx.measureText(classText).width;
  const badgeW = textWidth + 40;
  const badgeH = 44;

  ctx.fillStyle = dark;
  ctx.fillRect(w / 2 - badgeW / 2 + 3, classY - 26 + 3, badgeW, badgeH);

  ctx.fillStyle = yellow;
  ctx.fillRect(w / 2 - badgeW / 2, classY - 26, badgeW, badgeH);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(w / 2 - badgeW / 2, classY - 26, badgeW, badgeH);

  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(classText, w / 2, classY - 4);
  ctx.restore();

  // 4. Draw Members Grid
  const members = crew.members || [];
  members.forEach((m: any, idx: number) => {
    const layout = getMemberLayoutCard(members.length, idx);
    
    // Draw offset border (yellow)
    ctx.save();
    ctx.fillStyle = yellow;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.fillRect(layout.x - 5, layout.y - 5, layout.w + 10, layout.h + 10);
    ctx.strokeRect(layout.x - 5, layout.y - 5, layout.w + 10, layout.h + 10);
    ctx.restore();

    // Draw member image
    const mImg = images[m.id];
    if (mImg) {
      drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, { zoom: 1.0, panX: 0, panY: 0 });
    } else {
      ctx.fillStyle = '#c5d1c9';
      ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
    }

    // Outer pink image frame
    ctx.strokeStyle = pink;
    ctx.lineWidth = 4;
    ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);

    // Label banner at the bottom of each member photo
    ctx.save();
    ctx.fillStyle = 'rgba(10, 46, 29, 0.88)';
    ctx.fillRect(layout.x, layout.y + layout.h - 46, layout.w, 46);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = cream;
    ctx.textAlign = 'center';
    ctx.fillText(m.name.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 28);

    ctx.font = '900 8px monospace';
    ctx.fillStyle = yellow;
    ctx.fillText(m.builderTitle.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 12);
    ctx.restore();
  });

  // 5. Tech crew stack footer details
  const footerY = h - 230;
  ctx.strokeStyle = 'rgba(10, 46, 29, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, footerY);
  ctx.lineTo(w - 150, footerY);
  ctx.stroke();

  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = green;
  ctx.textAlign = 'center';
  ctx.fillText(`CREW STACK // ${crew.crewStack || 'REACT • NODE • AI'}`, w / 2, footerY + 28);
  ctx.fillText(`BUILT TOGETHER AT THE BEACH ✦ OCT 2026`, w / 2, footerY + 50);

  // 6. Barcode & Serial
  const barcodeY = h - 130;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3;
  let cursorX = w / 2 - 200;
  const barcodeHeight = 44;
  const pattern = [2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 2, 4, 8, 2, 4, 2, 6, 8, 2, 4, 8, 2, 4, 6, 2];
  for (let i = 0; i < pattern.length; i++) {
    const width = pattern[i];
    ctx.fillStyle = i % 2 === 0 ? dark : 'rgba(0,0,0,0)';
    if (i % 2 === 0) {
      ctx.fillRect(cursorX, barcodeY, width, barcodeHeight);
    }
    cursorX += width;
  }

  ctx.font = '12px monospace';
  ctx.fillStyle = green;
  ctx.textAlign = 'center';
  ctx.fillText(`SERIAL: HH-CREW-${crew.code}`, w / 2, barcodeY + 65);

  ctx.restore();
}

// Draw Crew Poster (Green background, 1080x1350 tall)
export function drawCrewPoster(
  canvas: HTMLCanvasElement,
  crew: any,
  images: Record<string, HTMLImageElement>,
  variantIndex: number = 0
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const green = '#0b4f30';
  const dark = '#0a2e1d';
  const cream = '#faf8f0';
  const yellow = '#fadb14';
  const pink = '#ff007f';

  // 1. Background Goa Poster Green
  ctx.fillStyle = green;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = dark;
  ctx.lineWidth = 26;
  ctx.strokeRect(13, 13, w - 26, h - 26);

  // Background radial sun graphic
  ctx.fillStyle = yellow;
  ctx.beginPath();
  ctx.arc(w / 2, 280, 200, 0, Math.PI, true); // Sun arc
  ctx.fill();

  // Draw Sun rays
  ctx.strokeStyle = yellow;
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const angle = Math.PI + (i / 11) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(w / 2 + Math.cos(angle) * 215, 280 + Math.sin(angle) * 215);
    ctx.lineTo(w / 2 + Math.cos(angle) * 245, 280 + Math.sin(angle) * 245);
    ctx.stroke();
  }

  // Palms on edges
  drawPalmTree(ctx, 110, 420, 1.2, dark);
  drawPalmTree(ctx, w - 110, 420, 1.2, dark);

  // 2. Poster Typography Headers (Official Logo Style on Green Background)
  ctx.font = 'bold 54px serif';
  ctx.fillStyle = yellow;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HACKER', w / 2, 68);
  ctx.fillText('HOUSE', w / 2, 114);

  ctx.save();
  ctx.translate(w / 2, 91);
  ctx.rotate(-0.08);
  ctx.fillStyle = pink;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3.5;
  const pBadgeW = 96;
  const pBadgeH = 38;
  ctx.beginPath();
  ctx.roundRect(-pBadgeW / 2, -pBadgeH / 2, pBadgeW, pBadgeH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = yellow;
  ctx.fillText('गोवा', 0, 0);
  ctx.restore();

  ctx.font = '900 13px monospace';
  ctx.letterSpacing = '4px';
  ctx.fillStyle = cream;
  ctx.fillText('OCTOBER 28 - 31, 2026', w / 2, 150);

  // Crew name banner
  ctx.font = 'bold 54px serif';
  ctx.fillStyle = yellow;
  ctx.fillText(crew.name.toUpperCase(), w / 2, 220);

  ctx.font = '900 18px monospace';
  ctx.fillStyle = pink;
  ctx.fillText(`COLLECTIVE CLASS // ${(crew.generatedClass || 'THE GOA SHIPPERS').toUpperCase()}`, w / 2, 265);

  // 3. Draw Members Grid using getMemberLayoutPoster
  const members = crew.members || [];
  members.forEach((m: any, idx: number) => {
    const layout = getMemberLayoutPoster(members.length, idx);
    
    // Draw offset border (yellow)
    ctx.save();
    ctx.fillStyle = cream;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.fillRect(layout.x - 6, layout.y - 6, layout.w + 12, layout.h + 12);
    ctx.strokeRect(layout.x - 6, layout.y - 6, layout.w + 12, layout.h + 12);
    ctx.restore();

    // Draw member image
    const mImg = images[m.id];
    if (mImg) {
      drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, { zoom: 1.0, panX: 0, panY: 0 });
    } else {
      ctx.fillStyle = '#c5d1c9';
      ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
    }

    // Outer pink image frame
    ctx.strokeStyle = pink;
    ctx.lineWidth = 5;
    ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);

    // Label banner at the bottom of each member photo
    ctx.save();
    ctx.fillStyle = dark;
    ctx.fillRect(layout.x, layout.y + layout.h - 60, layout.w, 60);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = cream;
    ctx.textAlign = 'center';
    ctx.fillText(m.name.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 38);

    ctx.font = '900 10px monospace';
    ctx.fillStyle = yellow;
    ctx.fillText(m.builderTitle.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 15);
    ctx.restore();
  });

  // 4. Poster waves footer details
  drawWaves(ctx, w, h, dark, 12, 3);
  drawWaves(ctx, w, h, yellow, 8, 4);

  // Footer branding texts
  const footerY = h - 60;
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  ctx.fillText(`CREW STACK // ${crew.crewStack || 'REACT • NODE • AI'}`, w / 2, footerY - 55);
  ctx.font = 'bold 20px serif';
  ctx.fillStyle = cream;
  ctx.fillText(`SHIPPED TOGETHER AT HACKER HOUSE GOA ✦ #FrameInGoa`, w / 2, footerY - 15);

  ctx.restore();
}

// Draw Crew PFP (Green background, 1080x1080 square collage)
export function drawCrewPfp(
  canvas: HTMLCanvasElement,
  crew: any,
  images: Record<string, HTMLImageElement>
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const green = '#0b4f30';
  const dark = '#0a2e1d';
  const cream = '#faf8f0';
  const yellow = '#fadb14';
  const pink = '#ff007f';

  // 1. Background
  ctx.fillStyle = green;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = dark;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Background radial lines
  ctx.strokeStyle = 'rgba(250, 248, 240, 0.05)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    ctx.lineTo(w / 2 + Math.cos(angle) * 800, h / 2 + Math.sin(angle) * 800);
    ctx.stroke();
  }

  // 2. Draw Overlapping Circle Collage
  const members = crew.members || [];
  
  if (members.length === 1) {
    // 1 Member: Single center circle
    const cx = w / 2;
    const cy = h / 2 - 30;
    const r = 320;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    
    const mImg = images[members[0].id];
    if (mImg) {
      drawUserImage(ctx, mImg, cx - r, cy - r, r * 2, r * 2, { zoom: 1.0, panX: 0, panY: 0 });
    } else {
      ctx.fillStyle = '#c5d1c9';
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();
    
    // Circle border
    ctx.strokeStyle = yellow;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = dark;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 7, 0, Math.PI * 2);
    ctx.stroke();

  } else if (members.length === 2) {
    // 2 Members: Two overlapping circles (Left & Right)
    const r = 240;
    const cy = h / 2 - 20;
    const cx1 = 360;
    const cx2 = 720;

    // Member 1 (Left)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx1, cy, r, 0, Math.PI * 2);
    ctx.clip();
    const mImg1 = images[members[0].id];
    if (mImg1) {
      drawUserImage(ctx, mImg1, cx1 - r, cy - r, r * 2, r * 2, { zoom: 1.0, panX: 0, panY: 0 });
    } else {
      ctx.fillStyle = '#c5d1c9';
      ctx.fillRect(cx1 - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();

    ctx.strokeStyle = yellow;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx1, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Member 2 (Right)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx2, cy, r, 0, Math.PI * 2);
    ctx.clip();
    const mImg2 = images[members[1].id];
    if (mImg2) {
      drawUserImage(ctx, mImg2, cx2 - r, cy - r, r * 2, r * 2, { zoom: 1.0, panX: 0, panY: 0 });
    } else {
      ctx.fillStyle = '#c5d1c9';
      ctx.fillRect(cx2 - r, cy - r, r * 2, r * 2);
    }
    ctx.restore();

    ctx.strokeStyle = pink;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(cx2, cy, r, 0, Math.PI * 2);
    ctx.stroke();

  } else {
    // 3 Members: Pyramid Overlapping Circles
    const r = 200;
    const cx1 = 540; // Top Center
    const cy1 = 370;
    const cx2 = 360; // Bottom Left
    const cy2 = 690;
    const cx3 = 720; // Bottom Right
    const cy3 = 690;

    const coords = [
      { cx: cx1, cy: cy1, color: yellow, member: members[0] },
      { cx: cx2, cy: cy2, color: pink, member: members[1] },
      { cx: cx3, cy: cy3, color: cream, member: members[2] },
    ];

    coords.forEach(c => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, r, 0, Math.PI * 2);
      ctx.clip();
      const mImg = images[c.member.id];
      if (mImg) {
        drawUserImage(ctx, mImg, c.cx - r, c.cy - r, r * 2, r * 2, { zoom: 1.0, panX: 0, panY: 0 });
      } else {
        ctx.fillStyle = '#c5d1c9';
        ctx.fillRect(c.cx - r, c.cy - r, r * 2, r * 2);
      }
      ctx.restore();

      ctx.strokeStyle = c.color;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(c.cx, c.cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  // 3. Stamp Label at bottom
  ctx.save();
  ctx.translate(w / 2, h - 110);
  ctx.rotate(-0.04);

  const bannerW = 600;
  const bannerH = 76;

  ctx.fillStyle = dark;
  ctx.fillRect(-bannerW / 2 + 5, -bannerH / 2 + 5, bannerW, bannerH);

  ctx.fillStyle = yellow;
  ctx.fillRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH);
  ctx.strokeStyle = cream;
  ctx.lineWidth = 3;
  ctx.strokeRect(-bannerW / 2, -bannerH / 2, bannerW, bannerH);

  ctx.font = 'bold 36px serif';
  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(crew.name.toUpperCase(), 0, 0);
  ctx.restore();

  // "HH GOA 2026" tiny tag
  ctx.font = 'bold 13px monospace';
  ctx.fillStyle = yellow;
  ctx.textAlign = 'center';
  ctx.fillText('✦ HH GOA BUILDER COLLECTIVE ✦', w / 2, h - 35);

  ctx.restore();
}


