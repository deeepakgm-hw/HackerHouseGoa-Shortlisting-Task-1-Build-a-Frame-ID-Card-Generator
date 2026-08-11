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

// Draw barcode for hacker theme
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string = '#0a2e1d') {
  ctx.save();
  ctx.fillStyle = color;
  let curX = x;
  while (curX < x + w) {
    const barW = Math.random() > 0.4 ? 2 : 5;
    ctx.fillRect(curX, y, barW, h);
    curX += barW + (Math.random() > 0.5 ? 2 : 4);
  }
  ctx.restore();
}

export function drawPfpFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  settings: ImageSettings,
  details: BuilderDetails,
  variantIndex: number = 0
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const green = '#0b4f30';
  const cream = '#faf8f0';
  const yellow = '#fadb14';
  const pink = '#ff007f';
  const dark = '#0a2e1d';

  // Define colors based on variantIndex
  let bg = cream;
  let primaryBorder = dark;
  let textPrimary = dark;
  let textSecondary = green;

  if (variantIndex === 1) {
    // Retro Green Theme
    bg = '#f2f0e8'; // Muted vintage cream
    primaryBorder = dark;
    textPrimary = dark;
    textSecondary = green;
  } else if (variantIndex === 2) {
    // Hacker Stamp Theme
    bg = cream;
    primaryBorder = dark;
    textPrimary = dark;
    textSecondary = pink;
  }

  // 1. Draw background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = primaryBorder;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Background pattern based on theme
  if (variantIndex === 0) {
    // Goa Sunset: Dotted pattern + palm tree silhouette in corner + sunset sun
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 45; x < w - 45; x += 25) {
      for (let y = 45; y < h - 45; y += 25) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Draw a small sunset sun in background corner
    ctx.fillStyle = 'rgba(250, 219, 20, 0.2)';
    ctx.beginPath();
    ctx.arc(w - 180, 180, 80, 0, Math.PI * 2);
    ctx.fill();

    // Wave pattern bottom
    drawWaves(ctx, w, h, 'rgba(11, 79, 48, 0.08)', 6, 2);
    
    // Corner decoration: Palm trees
    drawPalmTree(ctx, 60, h - 200, 0.8, 'rgba(11, 79, 48, 0.15)');
    drawPalmTree(ctx, w - 120, h - 200, 0.8, 'rgba(11, 79, 48, 0.15)');

  } else if (variantIndex === 1) {
    // Retro Green: Grid lines in background for a technical/retro design studio look
    ctx.strokeStyle = 'rgba(11, 79, 48, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = 60; x < w - 60; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, h - 20);
      ctx.stroke();
    }
    for (let y = 60; y < h - 60; y += 60) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }
  } else {
    // Hacker Stamp: Dotted pattern + barcode + technical markings
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 45; x < w - 45; x += 20) {
      for (let y = 45; y < h - 45; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Barcode in upper corner
    drawBarcode(ctx, w - 180, 40, 120, 30, 'rgba(10, 46, 29, 0.45)');
    
    // Hacker markings in bottom left corner: e.g. diagonal lines
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, h - 140); ctx.lineTo(140, h - 40);
    ctx.moveTo(40, h - 120); ctx.lineTo(120, h - 40);
    ctx.stroke();
  }

  // Draw corner marks/stars based on theme
  const drawCornerStar = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = primaryBorder;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.quadraticCurveTo(0, 0, 12, 0);
    ctx.quadraticCurveTo(0, 0, 0, 12);
    ctx.quadraticCurveTo(0, 0, -12, 0);
    ctx.quadraticCurveTo(0, 0, 0, -12);
    ctx.fill();
    ctx.restore();
  };

  const drawCornerCrosshair = (x: number, y: number) => {
    ctx.save();
    ctx.strokeStyle = primaryBorder;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 15, y); ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  if (variantIndex === 0 || variantIndex === 2) {
    drawCornerStar(50, 50);
    drawCornerStar(w - 50, 50);
    drawCornerStar(50, h - 50);
    drawCornerStar(w - 50, h - 50);
  } else {
    // Retro Green has crosshairs/print marks
    drawCornerCrosshair(60, 60);
    drawCornerCrosshair(w - 60, 60);
    drawCornerCrosshair(60, h - 60);
    drawCornerCrosshair(w - 60, h - 60);
  }

  // Top event banner micro-header
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (variantIndex === 0) {
    ctx.fillText('✦ HH GOA BUILDER COLLECTIVE ✦', w / 2, 70);
  } else if (variantIndex === 1) {
    ctx.fillText('[ HH GOA 2026 // VINTAGE EDITION ]', w / 2, 70);
  } else {
    ctx.fillText('⚡ HACKER HOUSE GOA // STAMP VERIFIED ⚡', w / 2, 70);
  }

  // 2. Avatar Center Positions
  const avatarX = w / 2;
  const avatarY = 410;
  const avatarR = 240;

  // Segmented "BUILDER SIGNAL" Arcs
  ctx.save();
  ctx.lineWidth = 10;
  const arcR = avatarR + 25;

  if (variantIndex === 0) {
    // Goa Sunset: Vibrant segments
    ctx.strokeStyle = yellow;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, -Math.PI * 0.95, -Math.PI * 0.55); ctx.stroke();
    ctx.strokeStyle = pink;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, -Math.PI * 0.45, -Math.PI * 0.05); ctx.stroke();
    ctx.strokeStyle = green;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, Math.PI * 0.05, Math.PI * 0.45); ctx.stroke();
    ctx.strokeStyle = dark;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, Math.PI * 0.55, Math.PI * 0.95); ctx.stroke();
  } else if (variantIndex === 1) {
    // Retro Green: Restrained segments
    ctx.strokeStyle = dark;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, -Math.PI * 0.95, -Math.PI * 0.55); ctx.stroke();
    ctx.strokeStyle = yellow;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, -Math.PI * 0.45, -Math.PI * 0.05); ctx.stroke();
    ctx.strokeStyle = green;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, Math.PI * 0.05, Math.PI * 0.45); ctx.stroke();
    ctx.strokeStyle = dark;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, Math.PI * 0.55, Math.PI * 0.95); ctx.stroke();
  } else {
    // Hacker Stamp: Segments + Tick marks
    ctx.strokeStyle = pink;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, -Math.PI * 0.95, -Math.PI * 0.55); ctx.stroke();
    ctx.strokeStyle = yellow;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, -Math.PI * 0.45, -Math.PI * 0.05); ctx.stroke();
    ctx.strokeStyle = dark;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, Math.PI * 0.05, Math.PI * 0.45); ctx.stroke();
    ctx.strokeStyle = pink;
    ctx.beginPath(); ctx.arc(avatarX, avatarY, arcR, Math.PI * 0.55, Math.PI * 0.95); ctx.stroke();

    // Draw little tick marks crossing the arc
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(avatarX + (arcR - 8) * Math.cos(angle), avatarY + (arcR - 8) * Math.sin(angle));
      ctx.lineTo(avatarX + (arcR + 8) * Math.cos(angle), avatarY + (arcR + 8) * Math.sin(angle));
      ctx.stroke();
    }
  }
  ctx.restore();

  // Offset shadow circle
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(avatarX + 8, avatarY + 8, avatarR, 0, Math.PI * 2);
  ctx.fill();

  // Layered circular emblem
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
  ctx.fill();

  // Inner rings colors based on theme
  let ring1 = yellow;
  let ring2 = pink;
  if (variantIndex === 1) {
    ring1 = cream;
    ring2 = green;
  } else if (variantIndex === 2) {
    ring1 = pink;
    ring2 = yellow;
  }

  ctx.fillStyle = ring1;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR - 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = ring2;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR - 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarR - 20, 0, Math.PI * 2);
  ctx.clip();

  if (img) {
    drawUserImage(ctx, img, avatarX - (avatarR - 20), avatarY - (avatarR - 20), (avatarR - 20) * 2, (avatarR - 20) * 2, settings);
  } else {
    ctx.fillStyle = '#c5d1c9';
    ctx.fillRect(avatarX - (avatarR - 20), avatarY - (avatarR - 20), (avatarR - 20) * 2, (avatarR - 20) * 2);
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = green;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('UPLOAD PHOTO', avatarX, avatarY);
  }
  ctx.restore();

  // Attach branding stickers/badges to circular edge
  if (variantIndex === 0) {
    // Goa Sunset: Pink & Yellow stickers
    // Top-Left "HH GOA" badge
    ctx.save();
    ctx.translate(avatarX - 170, avatarY - 170);
    ctx.rotate(-0.06);
    ctx.fillStyle = pink;
    ctx.beginPath(); ctx.roundRect(-55, -20, 110, 40, 6); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.font = 'bold 15px monospace'; ctx.fillStyle = yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HH GOA', 0, 0);
    ctx.restore();

    // Top-Right "2026" badge
    ctx.save();
    ctx.translate(avatarX + 170, avatarY - 170);
    ctx.rotate(0.06);
    ctx.fillStyle = yellow;
    ctx.beginPath(); ctx.roundRect(-45, -20, 90, 40, 6); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.font = 'bold 15px monospace'; ctx.fillStyle = dark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('2026', 0, 0);
    ctx.restore();

  } else if (variantIndex === 1) {
    // Retro Green: Cream & Green badges
    // Top-Left "BUILDER" badge
    ctx.save();
    ctx.translate(avatarX - 170, avatarY - 170);
    ctx.rotate(-0.04);
    ctx.fillStyle = cream;
    ctx.beginPath(); ctx.roundRect(-55, -20, 110, 40, 4); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.font = 'bold 15px monospace'; ctx.fillStyle = dark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BUILDER', 0, 0);
    ctx.restore();

    // Top-Right "GOA '26" badge
    ctx.save();
    ctx.translate(avatarX + 170, avatarY - 170);
    ctx.rotate(0.04);
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.roundRect(-50, -20, 100, 40, 4); ctx.fill();
    ctx.strokeStyle = cream; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.font = 'bold 15px monospace'; ctx.fillStyle = yellow; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText("GOA '26", 0, 0);
    ctx.restore();

  } else {
    // Hacker Stamp: Pink & Dark warning label badges
    // Top-Left "VERIFIED" stamp badge
    ctx.save();
    ctx.translate(avatarX - 170, avatarY - 170);
    ctx.rotate(-0.08);
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.roundRect(-60, -20, 120, 40, 2); ctx.fill();
    ctx.strokeStyle = pink; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = pink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('VERIFIED ⚡', 0, 0);
    ctx.restore();

    // Top-Right "HACKER" stamp badge
    ctx.save();
    ctx.translate(avatarX + 170, avatarY - 170);
    ctx.rotate(0.08);
    ctx.fillStyle = pink;
    ctx.beginPath(); ctx.roundRect(-55, -20, 110, 40, 2); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = 'bold 15px monospace'; ctx.fillStyle = dark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('HACKER', 0, 0);
    ctx.restore();
  }

  // 3. Name, Role, Stack, and Location Layout calculations
  const hasName = !!details.name && details.name.trim().toUpperCase() !== 'YOUR NAME' && details.name.trim() !== '';
  const hasRole = !!details.role && details.role.trim().toUpperCase() !== 'YOUR ROLE' && details.role.trim() !== '';
  const hasStack = !!details.stack && details.stack.trim().toUpperCase() !== 'YOUR STACK' && details.stack.trim() !== '';
  const hasLocation = !!details.location && details.location.trim().toUpperCase() !== 'GOA, INDIA' && details.location.trim() !== '';
  const hasHandle = !!details.twitter && details.twitter.trim().toUpperCase() !== '@HANDLE' && details.twitter.trim() !== '';

  const plateW = 480;
  const plateH = 86;
  const plateX = w / 2 - plateW / 2;
  const plateY = avatarY + avatarR - 50; // 600

  if (hasName) {
    // Shadow
    ctx.fillStyle = dark;
    ctx.fillRect(plateX + 8, plateY + 8, plateW, plateH);
    ctx.strokeRect(plateX + 8, plateY + 8, plateW, plateH);

    // Background and border
    ctx.fillStyle = variantIndex === 1 ? cream : variantIndex === 2 ? yellow : cream;
    ctx.fillRect(plateX, plateY, plateW, plateH);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 4;
    ctx.strokeRect(plateX, plateY, plateW, plateH);

    // User Name
    const nameText = details.name.toUpperCase();
    let nameSize = 42;
    ctx.font = `900 ${nameSize}px serif`;
    while (ctx.measureText(nameText).width > plateW - 40 && nameSize > 20) {
      nameSize -= 2;
      ctx.font = `900 ${nameSize}px serif`;
    }
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nameText, w / 2, plateY + plateH / 2);

    let currentY = plateY + plateH + 45; // 731

    if (hasRole) {
      const roleText = details.role.toUpperCase() + " BUILDER";
      let roleSize = 22;
      ctx.font = `bold ${roleSize}px monospace`;
      while (ctx.measureText(roleText).width > w - 120 && roleSize > 14) {
        roleSize -= 1;
        ctx.font = `bold ${roleSize}px monospace`;
      }
      ctx.fillStyle = textSecondary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(roleText, w / 2, currentY);
      currentY += 45;
    }

    if (hasStack) {
      const rawTags = details.stack.split(/[,•]/).map((s: string) => s.trim().toUpperCase()).filter(Boolean);
      const tags = rawTags.slice(0, 3);

      ctx.font = 'bold 15px monospace';
      const tagPadd = 16;
      const tagH = 38;
      const tagGap = 12;

      const tagWidths = tags.map((t: string) => ctx.measureText(t).width + tagPadd * 2);
      const totalWidth = tagWidths.reduce((a: number, b: number) => a + b, 0) + tagGap * (tags.length - 1);

      let startX = w / 2 - totalWidth / 2;
      const tagY = currentY - 15;

      tags.forEach((t: string, idx: number) => {
        const tagW = tagWidths[idx];

        ctx.fillStyle = dark;
        ctx.fillRect(startX + 3, tagY + 3, tagW, tagH);
        ctx.strokeRect(startX + 3, tagY + 3, tagW, tagH);

        let tagBg = idx % 3 === 0 ? yellow : idx % 3 === 1 ? cream : pink;
        if (variantIndex === 1) {
          tagBg = idx % 2 === 0 ? cream : yellow;
        } else if (variantIndex === 2) {
          tagBg = idx % 2 === 0 ? pink : dark;
        }

        ctx.fillRect(startX, tagY, tagW, tagH);
        ctx.strokeStyle = dark;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(startX, tagY, tagW, tagH);

        if (variantIndex === 2 && idx % 2 === 1) {
          ctx.fillStyle = cream;
        } else if (tagBg === pink) {
          ctx.fillStyle = cream;
        } else {
          ctx.fillStyle = dark;
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t, startX + tagW / 2, tagY + tagH / 2);

        startX += tagW + tagGap;
      });

      currentY += 45;
    }

    if (hasLocation || hasHandle) {
      let footerText = '';
      if (hasLocation && hasHandle) {
        footerText = `${(details.location || '').toUpperCase()}  ✦  ${(details.twitter || '').toLowerCase()}`;
      } else if (hasLocation) {
        footerText = (details.location || '').toUpperCase();
      } else {
        footerText = (details.twitter || '').toLowerCase();
      }

      ctx.font = '900 15px monospace';
      ctx.fillStyle = textPrimary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(footerText, w / 2, currentY + 10);
    }
  } else {
    // If no name is provided, draw the original fallback label so the PFP is not blank
    ctx.fillStyle = dark;
    ctx.fillRect(plateX + 8, plateY + 8, plateW, plateH);
    ctx.strokeRect(plateX + 8, plateY + 8, plateW, plateH);

    ctx.fillStyle = variantIndex === 1 ? cream : variantIndex === 2 ? yellow : cream;
    ctx.fillRect(plateX, plateY, plateW, plateH);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 4;
    ctx.strokeRect(plateX, plateY, plateW, plateH);

    ctx.font = '900 42px serif';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BUILDER', w / 2, plateY + plateH / 2);
  }

  // Small event footer at the absolute bottom
  ctx.font = '900 13px monospace';
  ctx.fillStyle = pink;
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  if (variantIndex === 0) {
    ctx.fillText('OCT 28-31, 2026 // GOA READY', w / 2, h - 55);
  } else if (variantIndex === 1) {
    ctx.fillStyle = green;
    ctx.fillText('OCT 2026 // SHIPPED AT THE BEACH', w / 2, h - 55);
  } else {
    ctx.fillText('SERIAL // GOA-' + (details.twitter || '99D5').toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 5) + ' // 5/5 SHIP', w / 2, h - 55);
  }
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

  // Base values depending on theme
  let bg = cream;
  let borderColor = dark;
  let textPrimary = dark;
  let textSecondary = green;

  if (variantIndex === 1) {
    bg = '#f2f0e8'; // Vintage muted cream
  }

  // 1. Draw card background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 26;
  ctx.strokeRect(13, 13, w - 26, h - 26);

  // Background decoration based on theme
  if (variantIndex === 0) {
    // Goa Sunset: Dotted pattern
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 40; x < w - 40; x += 25) {
      for (let y = 40; y < h - 40; y += 25) {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Waves bottom
    drawWaves(ctx, w, h, 'rgba(11, 79, 48, 0.08)', 8, 3);
  } else if (variantIndex === 1) {
    // Retro Green: Clean blueprint grid lines
    ctx.strokeStyle = 'rgba(11, 79, 48, 0.07)';
    ctx.lineWidth = 1.5;
    for (let x = 60; x < w - 60; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 26); ctx.lineTo(x, h - 26); ctx.stroke();
    }
    for (let y = 60; y < h - 60; y += 60) {
      ctx.beginPath(); ctx.moveTo(26, y); ctx.lineTo(w - 26, y); ctx.stroke();
    }
  } else {
    // Hacker Stamp: Technical tick grids + diagonal hazard corners
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 40; x < w - 40; x += 20) {
      for (let y = 40; y < h - 40; y += 20) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }
    // Barcode watermarks
    drawBarcode(ctx, w - 190, 240, 130, 30, 'rgba(10, 46, 29, 0.35)');
  }

  // 2. Main Event Header
  if (variantIndex === 0) {
    // Goa Sunset Header: Solid green box, yellow border, pink Devanagari badge
    ctx.fillStyle = green;
    ctx.fillRect(26, 26, w - 52, 180);

    ctx.strokeStyle = yellow;
    ctx.lineWidth = 4;
    ctx.strokeRect(38, 38, w - 76, 156);

    ctx.font = 'bold 62px serif';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HACKER', w / 2, 88);
    ctx.fillText('HOUSE', w / 2, 136);

    ctx.save();
    ctx.translate(w / 2, 112);
    ctx.rotate(-0.08);
    ctx.fillStyle = pink;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3.5;
    const logoBadgeW = 110;
    const logoBadgeH = 42;
    ctx.beginPath(); ctx.roundRect(-logoBadgeW / 2, -logoBadgeH / 2, logoBadgeW, logoBadgeH, 12); ctx.fill(); ctx.stroke();
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = yellow;
    ctx.fillText('गोवा', 0, 0);
    ctx.restore();

    ctx.font = '900 13px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = cream;
    ctx.fillText('OCT 28-31, 2026', w / 2, 168);

  } else if (variantIndex === 1) {
    // Retro Green Header: Muted outline box, classic typography
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, w - 80, 150);
    
    ctx.fillStyle = dark;
    ctx.fillRect(40, 40, 300, 36);
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OFFICIAL BUILDER PASS', 190, 58);

    ctx.font = '900 36px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.fillText('HACKER HOUSE GOA // 26', w / 2, 120);
    
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = green;
    ctx.fillText('OCTOBER 28 - 31, 2026 ✦ GOA, INDIA', w / 2, 162);

  } else {
    // Hacker Stamp Header: Stamped warning lines and technical text
    ctx.fillStyle = dark;
    ctx.fillRect(26, 26, w - 52, 180);

    ctx.strokeStyle = pink;
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 36, w - 72, 160);

    // Hazard lines left/right
    ctx.strokeStyle = pink;
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); ctx.moveTo(60 + i * 15, 45); ctx.lineTo(45 + i * 15, 185); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 60 - i * 15, 45); ctx.lineTo(w - 45 - i * 15, 185); ctx.stroke();
    }

    ctx.font = '900 52px serif';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SQUAD BUILDER', w / 2, 90);

    ctx.save();
    ctx.translate(w / 2, 140);
    ctx.fillStyle = pink;
    ctx.beginPath(); ctx.roundRect(-220, -18, 440, 36, 2); ctx.fill();
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = cream;
    ctx.fillText('SECURITY STATUS: AUTHORIZED ACCESS ONLY // 2026', 0, 0);
    ctx.restore();
  }

  // 3. Profile Photo Layout
  const photoSize = 450;
  const photoX = w / 2 - photoSize / 2;
  const photoY = 245;

  if (variantIndex === 0) {
    // Goa Sunset: Yellow background offset, pink main border
    ctx.save();
    ctx.fillStyle = yellow;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 4;
    ctx.fillRect(photoX - 10, photoY - 10, photoSize + 20, photoSize + 20);
    ctx.strokeRect(photoX - 10, photoY - 10, photoSize + 20, photoSize + 20);
    ctx.restore();

    ctx.fillStyle = dark;
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
    if (img) {
      drawUserImage(ctx, img, photoX, photoY, photoSize, photoSize, imgSettings);
    }
    ctx.strokeStyle = pink;
    ctx.lineWidth = 6;
    ctx.strokeRect(photoX, photoY, photoSize, photoSize);

    // Star & Palm badges
    drawStar(ctx, photoX - 25, photoY - 20, 5, 20, 10, pink);
    
    ctx.save();
    ctx.translate(photoX + photoSize - 20, photoY - 20);
    ctx.fillStyle = yellow;
    ctx.beginPath(); ctx.arc(0, 0, 26, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2.5; ctx.stroke();
    drawPalmTree(ctx, 0, -18, 0.45, dark);
    ctx.restore();

  } else if (variantIndex === 1) {
    // Retro Green: Double dark green border, corner ticks, no offsets
    ctx.save();
    ctx.fillStyle = dark;
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
    if (img) {
      drawUserImage(ctx, img, photoX, photoY, photoSize, photoSize, imgSettings);
    }
    ctx.strokeStyle = dark;
    ctx.lineWidth = 4;
    ctx.strokeRect(photoX, photoY, photoSize, photoSize);
    ctx.strokeRect(photoX + 8, photoY + 8, photoSize - 16, photoSize - 16);
    ctx.restore();

    // Corner cross tick marks
    ctx.strokeStyle = dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(photoX - 20, photoY); ctx.lineTo(photoX + 10, photoY);
    ctx.moveTo(photoX, photoY - 20); ctx.lineTo(photoX, photoY + 10);
    ctx.stroke();

  } else {
    // Hacker Stamp: Black border, neon pink offset shadow, technical stamp label
    ctx.save();
    // Pink offset shadow
    ctx.fillStyle = pink;
    ctx.fillRect(photoX + 12, photoY + 12, photoSize, photoSize);
    ctx.strokeRect(photoX + 12, photoY + 12, photoSize, photoSize);
    
    ctx.fillStyle = dark;
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
    if (img) {
      drawUserImage(ctx, img, photoX, photoY, photoSize, photoSize, imgSettings);
    }
    ctx.strokeStyle = dark;
    ctx.lineWidth = 5;
    ctx.strokeRect(photoX, photoY, photoSize, photoSize);
    ctx.restore();

    // "SHIP IT" badge stamp in corner
    ctx.save();
    ctx.translate(photoX + photoSize - 30, photoY + photoSize - 10);
    ctx.rotate(-0.12);
    ctx.fillStyle = yellow;
    ctx.beginPath(); ctx.roundRect(-60, -18, 120, 36, 3); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.font = 'bold 14px monospace'; ctx.fillStyle = dark; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('SHIP IT 🚀', 0, 0);
    ctx.restore();
  }

  // 4. Primary Content: Name & Title
  const contentY = 730;

  // Category Stamp
  ctx.font = 'bold 20px monospace';
  ctx.fillStyle = variantIndex === 1 ? green : pink;
  ctx.textAlign = 'center';
  if (variantIndex === 0) {
    ctx.fillText('✦ HH GOA BUILDER PASS ✦', w / 2, contentY);
  } else if (variantIndex === 1) {
    ctx.fillText('✦ STACK AND CREDENTIALS ✦', w / 2, contentY);
  } else {
    ctx.fillText('⚠️ ACCESS PORTAL APPROVED // SYSTEM: ACTIVE', w / 2, contentY);
  }

  // Name
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

  // Builder Title
  const displayTitle = (details.title || 'BUILDER TITLE').toUpperCase();
  let titleFontSize = 30;
  if (displayTitle.length > 25) {
    titleFontSize = 22;
  }
  ctx.font = `bold ${titleFontSize}px monospace`;
  ctx.fillStyle = variantIndex === 2 ? pink : green;
  ctx.textAlign = 'center';
  ctx.fillText(displayTitle, w / 2, contentY + 135);

  // Separator Line
  const metaY = contentY + 190;
  ctx.strokeStyle = 'rgba(10, 46, 29, 0.15)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(180, metaY); ctx.lineTo(w - 180, metaY);
  ctx.stroke();

  // Spaced metadata columns
  const roleVal = (details.role || 'BUILDER').toUpperCase();
  const stackVal = (details.stack || 'GENERAL').toUpperCase();
  const locVal = (details.location || 'GOA HOUSE').toUpperCase();
  const twitterVal = (details.twitter || '@HHGOA').trim().toUpperCase();

  const colLeftX = 220;
  const colRightX = w - 220;
  const row2Y = metaY + 105;

  ctx.textBaseline = 'top';

  if (variantIndex === 1) {
    // Retro Green: draws nice individual boxes for metadata elements
    const boxW = 280;
    const boxH = 70;

    const drawMetaBox = (x: number, y: number, label: string, val: string, align: 'left' | 'right') => {
      ctx.save();
      const startX = align === 'left' ? x : x - boxW;
      
      ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
      ctx.fillRect(startX, y, boxW, boxH);
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, y, boxW, boxH);

      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = green;
      ctx.textAlign = 'left';
      ctx.fillText(label, startX + 12, y + 10);

      ctx.font = 'bold 18px serif';
      ctx.fillStyle = dark;
      ctx.fillText(val, startX + 12, y + 32);
      ctx.restore();
    };

    drawMetaBox(colLeftX, metaY + 15, 'STACK', stackVal, 'left');
    drawMetaBox(colRightX, metaY + 15, 'ROLE', roleVal, 'right');
    drawMetaBox(colLeftX, row2Y, 'LOCATION', locVal, 'left');
    drawMetaBox(colRightX, row2Y, 'HANDLE', twitterVal, 'right');

  } else {
    // Sunset and Hacker: Classic columns
    // ROW 1: STACK (Left) & ROLE (Right)
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = variantIndex === 2 ? pink : pink;
    ctx.textAlign = 'left'; ctx.fillText('STACK', colLeftX, metaY + 20);
    ctx.font = 'bold 26px serif'; ctx.fillStyle = dark; ctx.fillText(stackVal, colLeftX, metaY + 44);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = variantIndex === 2 ? pink : pink;
    ctx.textAlign = 'right'; ctx.fillText('ROLE', colRightX, metaY + 20);
    ctx.font = 'bold 26px serif'; ctx.fillStyle = dark; ctx.fillText(roleVal, colRightX, metaY + 44);

    // ROW 2: LOCATION (Left) & HANDLE (Right)
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = variantIndex === 2 ? pink : pink;
    ctx.textAlign = 'left'; ctx.fillText('LOCATION', colLeftX, row2Y);
    ctx.font = 'bold 26px serif'; ctx.fillStyle = dark; ctx.fillText(locVal, colLeftX, row2Y + 24);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = variantIndex === 2 ? pink : pink;
    ctx.textAlign = 'right'; ctx.fillText('HANDLE', colRightX, row2Y);
    ctx.font = 'bold 26px serif'; ctx.fillStyle = dark; ctx.fillText(twitterVal, colRightX, row2Y + 24);
  }

  // Bottom separator line
  ctx.strokeStyle = 'rgba(10, 46, 29, 0.15)';
  ctx.beginPath();
  ctx.moveTo(180, row2Y + 70); ctx.lineTo(w - 180, row2Y + 70);
  ctx.stroke();

  // 6. GOA READY Stamp (Jagged Circle outline, stamped on card - highly legible)
  if (variantIndex !== 1) {
    ctx.save();
    ctx.translate(w - 145, metaY + 95); // Moved to lower-right area near metadata columns
    ctx.rotate(-0.08);
    
    const stampR = 32; // 64px diameter
    ctx.fillStyle = pink;
    ctx.beginPath(); ctx.arc(0, 0, stampR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 2.5; ctx.stroke();

    ctx.strokeStyle = cream;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 2]);
    ctx.beginPath(); ctx.arc(0, 0, stampR - 5, 0, Math.PI * 2); ctx.stroke();

    ctx.font = '900 10px monospace'; ctx.fillStyle = cream; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('GOA', 0, -8);
    ctx.font = 'bold 12px serif'; ctx.fillText('READY', 0, 6);
    ctx.restore();
  }

  // 7. Barcode & Serial Footer
  const barcodeY = h - 140;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  let cursorX = w / 2 - 250;
  const barcodeHeight = 56;

  if (variantIndex === 1) {
    // Retro Green: draws fine, clean lines instead of a solid barcode
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1;
    ctx.strokeRect(w / 2 - 200, barcodeY, 400, 24);
    ctx.font = '11px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.fillText('SYSTEM RECORD COMPLIANT // DEPLOY CODE ' + (details.stack || 'BUILD').substring(0,4).toUpperCase(), w / 2, barcodeY + 16);
  } else {
    const pattern = [2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 2, 4, 8, 2, 4, 2, 6, 8, 2, 4, 8, 2, 4, 6, 2];
    for (let i = 0; i < pattern.length; i++) {
      const width = pattern[i];
      if (i % 2 === 0) {
        ctx.fillRect(cursorX, barcodeY, width, barcodeHeight);
      }
      cursorX += width;
    }
  }

  // Serial Text
  ctx.font = '15px monospace';
  ctx.fillStyle = green;
  ctx.textAlign = 'center';
  const nameCode = details.name ? details.name.substring(0, 3).toUpperCase().padEnd(3, 'X') : 'HCK';
  const nameSum = (details.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const serialNo = String(1000 + (nameSum % 9000)).padStart(4, '0');
  
  if (variantIndex === 1) {
    ctx.fillText(`ID: ${serialNo} // VERIFIED IN GOA`, w / 2, barcodeY + 65);
  } else {
    ctx.fillText(`HH26 • GOA • ${nameCode} • ${serialNo}`, w / 2, barcodeY + 80);
  }

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
export function getMemberLayoutCard(count: number, idx: number): { x: number; y: number; w: number; h: number } {
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

  // Base background and colors
  let bg = cream;
  let borderColor = dark;
  let textPrimary = dark;
  let textSecondary = green;

  if (variantIndex === 1) {
    bg = '#f2f0e8'; // Vintage muted cream
  }

  // 1. Draw Background Base
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Background pattern based on theme
  if (variantIndex === 0) {
    // Goa Sunset: Dotted pattern
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 30; x < w - 30; x += 22) {
      for (let y = 30; y < h - 30; y += 22) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }
  } else if (variantIndex === 1) {
    // Retro Green: Grid lines
    ctx.strokeStyle = 'rgba(11, 79, 48, 0.06)';
    ctx.lineWidth = 1.5;
    for (let x = 50; x < w - 50; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, h - 20); ctx.stroke();
    }
    for (let y = 50; y < h - 50; y += 50) {
      ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(w - 20, y); ctx.stroke();
    }
  } else {
    // Hacker Stamp: Technical crosshairs + barcode marks
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 30; x < w - 30; x += 20) {
      for (let y = 30; y < h - 30; y += 20) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }
    drawBarcode(ctx, w - 180, 175, 120, 24, 'rgba(10, 46, 29, 0.35)');
  }

  // 2. Main Event Header
  if (variantIndex === 0) {
    ctx.fillStyle = green;
    ctx.fillRect(20, 20, w - 40, 130);

    ctx.strokeStyle = yellow;
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, w - 60, 110);

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
    ctx.beginPath(); ctx.roundRect(-ccBadgeW / 2, -ccBadgeH / 2, ccBadgeW, ccBadgeH, 10); ctx.fill(); ctx.stroke();
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = yellow;
    ctx.fillText('गोवा', 0, 0);
    ctx.restore();

    ctx.font = '900 12px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = cream;
    ctx.fillText('OCTOBER 2026', w / 2, 122);

  } else if (variantIndex === 1) {
    // Retro Green Header
    ctx.strokeStyle = dark;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(30, 30, w - 60, 110);

    ctx.font = '900 32px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HACKER HOUSE GOA // CREW', w / 2, 72);

    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = green;
    ctx.fillText('OCTOBER 28-31, 2026 // EST. 2026', w / 2, 114);

  } else {
    // Hacker Stamp Header
    ctx.fillStyle = dark;
    ctx.fillRect(20, 20, w - 40, 130);

    ctx.strokeStyle = pink;
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, w - 60, 110);

    // Diagonal warning stripes inside hacker header
    ctx.strokeStyle = pink;
    ctx.lineWidth = 3.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(50 + i * 12, 35); ctx.lineTo(35 + i * 12, 135); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - 50 - i * 12, 35); ctx.lineTo(w - 35 - i * 12, 135); ctx.stroke();
    }

    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HACKER SQUAD PASS', w / 2, 85);
  }

  // 3. Crew Metadata Details
  const detailsY = 165;
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = variantIndex === 1 ? green : pink;
  ctx.textAlign = 'center';
  ctx.fillText(`✦ CREW PASS // CODE: ${crew.code} ✦`, w / 2, detailsY + 20);

  ctx.font = 'bold 44px serif';
  ctx.fillStyle = dark;
  ctx.fillText(crew.name.toUpperCase(), w / 2, detailsY + 65);

  // Crew Class Stamp
  const classY = detailsY + 110;
  ctx.save();
  ctx.font = 'bold 18px monospace';
  const classText = (crew.generatedClass || 'THE GOA SHIPPERS').toUpperCase();
  const textWidth = ctx.measureText(classText).width;
  const badgeW = textWidth + 40;
  const badgeH = 44;

  ctx.fillStyle = dark;
  ctx.fillRect(w / 2 - badgeW / 2 + 3, classY - 26 + 3, badgeW, badgeH);

  ctx.fillStyle = variantIndex === 2 ? pink : yellow;
  ctx.fillRect(w / 2 - badgeW / 2, classY - 26, badgeW, badgeH);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(w / 2 - badgeW / 2, classY - 26, badgeW, badgeH);

  ctx.fillStyle = variantIndex === 2 ? cream : dark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(classText, w / 2, classY - 4);
  ctx.restore();

  // 4. Draw Members Grid
  const members = crew.members || [];
  members.forEach((m: any, idx: number) => {
    const layout = getMemberLayoutCard(members.length, idx);
    
    if (variantIndex === 0) {
      // Goa Sunset offset frame
      ctx.save();
      ctx.fillStyle = yellow;
      ctx.strokeStyle = dark;
      ctx.lineWidth = 3;
      ctx.fillRect(layout.x - 5, layout.y - 5, layout.w + 10, layout.h + 10);
      ctx.strokeRect(layout.x - 5, layout.y - 5, layout.w + 10, layout.h + 10);
      ctx.restore();

      const mImg = images[m.id];
      if (mImg) {
        drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, m.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
      } else {
        ctx.fillStyle = '#c5d1c9'; ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
      }

      ctx.strokeStyle = pink;
      ctx.lineWidth = 4;
      ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);

    } else if (variantIndex === 1) {
      // Retro Green clean double frame
      ctx.fillStyle = dark;
      ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
      
      const mImg = images[m.id];
      if (mImg) {
        drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, m.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
      }

      ctx.strokeStyle = dark;
      ctx.lineWidth = 3;
      ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);
      ctx.strokeRect(layout.x + 6, layout.y + 6, layout.w - 12, layout.h - 12);

    } else {
      // Hacker Stamp offset frame
      ctx.save();
      ctx.fillStyle = pink;
      ctx.fillRect(layout.x + 6, layout.y + 6, layout.w, layout.h);
      ctx.restore();

      const mImg = images[m.id];
      if (mImg) {
        drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, m.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
      } else {
        ctx.fillStyle = '#c5d1c9'; ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
      }

      ctx.strokeStyle = dark;
      ctx.lineWidth = 4.5;
      ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);
    }

    // Label banner at the bottom of each member photo
    ctx.save();
    ctx.fillStyle = 'rgba(10, 46, 29, 0.95)';
    const bannerH = 76;
    ctx.fillRect(layout.x, layout.y + layout.h - bannerH, layout.w, bannerH);

    // Member Name
    let nameSize = 34;
    ctx.font = `bold ${nameSize}px sans-serif`;
    while (ctx.measureText(m.name.toUpperCase()).width > layout.w - 16 && nameSize > 18) {
      nameSize -= 2;
      ctx.font = `bold ${nameSize}px sans-serif`;
    }
    ctx.fillStyle = cream;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.name.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 48);

    // Member Role
    let titleSize = 18;
    ctx.font = `bold ${titleSize}px monospace`;
    while (ctx.measureText(m.builderTitle.toUpperCase()).width > layout.w - 20 && titleSize > 11) {
      titleSize -= 1;
      ctx.font = `bold ${titleSize}px monospace`;
    }
    ctx.fillStyle = variantIndex === 2 ? pink : yellow;
    ctx.fillText(m.builderTitle.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 20);
    ctx.restore();
  });

  // 5. Tech crew stack footer details
  const footerY = h - 230;
  ctx.strokeStyle = 'rgba(10, 46, 29, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, footerY); ctx.lineTo(w - 150, footerY);
  ctx.stroke();

  ctx.font = 'bold 15px monospace';
  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  ctx.fillText(`CREW STACK // ${crew.crewStack || 'REACT • NODE • AI'}`, w / 2, footerY + 28);
  
  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = green;
  if (variantIndex === 1) {
    ctx.fillText(`RETRO SQUAD SYSTEM // EST. 2026`, w / 2, footerY + 54);
  } else {
    ctx.fillText(`BUILT TOGETHER AT THE BEACH ✦ OCT 2026`, w / 2, footerY + 54);
  }

  // 6. Barcode & Serial
  const barcodeY = h - 130;
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3;
  let cursorX = w / 2 - 200;
  const barcodeHeight = 44;

  if (variantIndex === 1) {
    // Retro green: draw outline serial box
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(w / 2 - 180, barcodeY + 8, 360, 26);
    ctx.font = '11px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.fillText('SYSTEM OK // RECORD ID: ' + crew.code, w / 2, barcodeY + 24);
  } else {
    const pattern = [2, 6, 2, 4, 8, 2, 4, 6, 2, 8, 4, 2, 6, 2, 4, 8, 2, 4, 2, 6, 8, 2, 4, 8, 2, 4, 6, 2];
    for (let i = 0; i < pattern.length; i++) {
      const width = pattern[i];
      if (i % 2 === 0) {
        ctx.fillRect(cursorX, barcodeY, width, barcodeHeight);
      }
      cursorX += width;
    }
  }

  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  if (variantIndex === 1) {
    ctx.fillText(`SERIAL: HH-RETRO-SQUAD-${crew.code}`, w / 2, barcodeY + 65);
  } else {
    ctx.fillText(`SERIAL: HH-CREW-${crew.code}`, w / 2, barcodeY + 65);
  }

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

  // Base background and text colors depending on theme
  let bg = green;
  let borderColor = dark;
  let textColor = cream;

  if (variantIndex === 1) {
    bg = '#faf8f0'; // Muted vintage cream background for retro green poster
    borderColor = dark;
    textColor = dark;
  } else if (variantIndex === 2) {
    bg = cream;
    borderColor = dark;
    textColor = dark;
  }

  // 1. Draw Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 26;
  ctx.strokeRect(13, 13, w - 26, h - 26);

  // Background decoration based on theme
  if (variantIndex === 0) {
    // Goa Sunset: Giant yellow sunset horizon with sun rays in background
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

  } else if (variantIndex === 1) {
    // Retro Green: Grid lines in background
    ctx.strokeStyle = 'rgba(11, 79, 48, 0.06)';
    ctx.lineWidth = 1.5;
    for (let x = 60; x < w - 60; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 26); ctx.lineTo(x, h - 26); ctx.stroke();
    }
    for (let y = 60; y < h - 60; y += 60) {
      ctx.beginPath(); ctx.moveTo(26, y); ctx.lineTo(w - 26, y); ctx.stroke();
    }

    // Draw crosshair marks in corners
    const drawCornerCross = (cx: number, cy: number) => {
      ctx.strokeStyle = dark;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20);
      ctx.stroke();
    };
    drawCornerCross(50, 50);
    drawCornerCross(w - 50, 50);
    drawCornerCross(50, h - 50);
    drawCornerCross(w - 50, h - 50);

  } else {
    // Hacker Stamp: Technical labels + stamp details + barcode watermarks
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 40; x < w - 40; x += 25) {
      for (let y = 40; y < h - 40; y += 25) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    }
    drawBarcode(ctx, 50, 190, 140, 28, 'rgba(10, 46, 29, 0.45)');
    drawBarcode(ctx, w - 190, 190, 140, 28, 'rgba(10, 46, 29, 0.45)');
  }

  // 2. Poster Typography Headers
  if (variantIndex === 0) {
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
    ctx.beginPath(); ctx.roundRect(-pBadgeW / 2, -pBadgeH / 2, pBadgeW, pBadgeH, 12); ctx.fill(); ctx.stroke();
    ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = yellow; ctx.fillText('गोवा', 0, 0);
    ctx.restore();

    ctx.font = '900 13px monospace';
    ctx.letterSpacing = '4px';
    ctx.fillStyle = cream;
    ctx.fillText('OCTOBER 28 - 31, 2026', w / 2, 150);

  } else if (variantIndex === 1) {
    // Retro Green Header Style
    ctx.strokeStyle = dark;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, w - 80, 130);

    ctx.font = '900 42px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HACKER HOUSE // SQUAD PASS', w / 2, 85);

    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = green;
    ctx.fillText('SYSTEM OK // SHIPPED AT THE GOA BEACH // 2026', w / 2, 135);

  } else {
    // Hacker Stamp Header Style
    ctx.fillStyle = dark;
    ctx.fillRect(40, 40, w - 80, 130);

    ctx.strokeStyle = pink;
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, w - 100, 110);

    ctx.font = 'bold 44px sans-serif';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ HH GOA TEAM IDENTIFICATION ⚡', w / 2, 105);
  }

  // Crew name banner
  const nameY = variantIndex === 1 ? 210 : 220;
  ctx.font = 'bold 54px serif';
  ctx.fillStyle = variantIndex === 1 ? dark : yellow;
  ctx.textAlign = 'center';
  ctx.fillText(crew.name.toUpperCase(), w / 2, nameY);

  ctx.font = '900 18px monospace';
  ctx.fillStyle = variantIndex === 1 ? green : pink;
  ctx.fillText(`COLLECTIVE CLASS // ${(crew.generatedClass || 'THE GOA SHIPPERS').toUpperCase()}`, w / 2, nameY + 45);

  // 3. Draw Members Grid
  const members = crew.members || [];
  members.forEach((m: any, idx: number) => {
    const layout = getMemberLayoutPoster(members.length, idx);
    
    if (variantIndex === 0) {
      // Goa Sunset layout: Cream background offsets, pink borders
      ctx.save();
      ctx.fillStyle = cream;
      ctx.strokeStyle = dark;
      ctx.lineWidth = 3;
      ctx.fillRect(layout.x - 6, layout.y - 6, layout.w + 12, layout.h + 12);
      ctx.strokeRect(layout.x - 6, layout.y - 6, layout.w + 12, layout.h + 12);
      ctx.restore();

      const mImg = images[m.id];
      if (mImg) {
        drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, m.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
      } else {
        ctx.fillStyle = '#c5d1c9'; ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
      }

      ctx.strokeStyle = pink;
      ctx.lineWidth = 5;
      ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);

    } else if (variantIndex === 1) {
      // Retro Green clean double frame
      ctx.fillStyle = dark;
      ctx.fillRect(layout.x, layout.y, layout.w, layout.h);

      const mImg = images[m.id];
      if (mImg) {
        drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, m.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
      }

      ctx.strokeStyle = dark;
      ctx.lineWidth = 4;
      ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);
      ctx.strokeRect(layout.x + 8, layout.y + 8, layout.w - 16, layout.h - 16);

    } else {
      // Hacker Stamp offset layout
      ctx.save();
      ctx.fillStyle = pink;
      ctx.fillRect(layout.x + 8, layout.y + 8, layout.w, layout.h);
      ctx.restore();

      const mImg = images[m.id];
      if (mImg) {
        drawUserImage(ctx, mImg, layout.x, layout.y, layout.w, layout.h, m.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
      } else {
        ctx.fillStyle = '#c5d1c9'; ctx.fillRect(layout.x, layout.y, layout.w, layout.h);
      }

      ctx.strokeStyle = dark;
      ctx.lineWidth = 5;
      ctx.strokeRect(layout.x, layout.y, layout.w, layout.h);
    }

    // Label banner at the bottom of each member photo
    ctx.save();
    ctx.fillStyle = dark;
    ctx.fillRect(layout.x, layout.y + layout.h - 60, layout.w, 60);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = cream;
    ctx.textAlign = 'center';
    ctx.fillText(m.name.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 38);

    ctx.font = '900 10px monospace';
    ctx.fillStyle = variantIndex === 2 ? pink : yellow;
    ctx.fillText(m.builderTitle.toUpperCase(), layout.x + layout.w / 2, layout.y + layout.h - 15);
    ctx.restore();
  });

  // 4. Poster waves/grid footer details
  if (variantIndex === 0) {
    drawWaves(ctx, w, h, dark, 12, 3);
    drawWaves(ctx, w, h, yellow, 8, 4);

    const footerY = h - 60;
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.fillText(`CREW STACK // ${crew.crewStack || 'REACT • NODE • AI'}`, w / 2, footerY - 55);
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = cream;
    ctx.fillText(`SHIPPED TOGETHER AT HACKER HOUSE GOA ✦ #FrameInGoa`, w / 2, footerY - 15);

  } else if (variantIndex === 1) {
    // Retro Green footer: Clean straight lines and spacing
    const footerY = h - 60;
    ctx.strokeStyle = dark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(100, footerY - 70); ctx.lineTo(w - 100, footerY - 70);
    ctx.stroke();

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = dark;
    ctx.textAlign = 'center';
    ctx.fillText(`CREW STACK // ${crew.crewStack || 'REACT • NODE • AI'}`, w / 2, footerY - 42);

    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = green;
    ctx.fillText(`BUILDER HOUSE SYSTEM CERTIFICATE // OFFICIAL VINTAGE PRINT`, w / 2, footerY - 15);

  } else {
    // Hacker Stamp footer: Warning block, serial labels
    const footerY = h - 60;
    ctx.fillStyle = dark;
    ctx.fillRect(80, footerY - 80, w - 160, 60);

    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = yellow;
    ctx.textAlign = 'center';
    ctx.fillText(`CREW STACK // ${crew.crewStack || 'REACT • NODE • AI'}`, w / 2, footerY - 45);

    ctx.font = '900 13px monospace';
    ctx.fillStyle = pink;
    ctx.fillText(`SQUAD-SERIAL: ${crew.code} // BUILD-SHIP-CREATE-COLLAB`, w / 2, footerY - 25);
  }

  ctx.restore();
}

// Draw Crew PFP (Unified circular emblem style with Goa Sunset, Retro Green, Hacker Stamp variants)
export function drawCrewPfp(
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

  // Define colors based on variantIndex
  let bg = cream;
  let primaryBorder = dark;
  let textPrimary = dark;
  let textSecondary = green;

  if (variantIndex === 1) {
    bg = '#f2f0e8'; // Muted vintage cream
    primaryBorder = dark;
    textPrimary = dark;
    textSecondary = green;
  } else if (variantIndex === 2) {
    bg = cream;
    primaryBorder = dark;
    textPrimary = dark;
    textSecondary = pink;
  }

  // 1. Base background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = primaryBorder;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Background pattern based on theme
  if (variantIndex === 0) {
    ctx.fillStyle = 'rgba(11, 79, 48, 0.05)';
    for (let x = 45; x < w - 45; x += 25) {
      for (let y = 45; y < h - 45; y += 25) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Sunset sun
    ctx.fillStyle = 'rgba(250, 219, 20, 0.2)';
    ctx.beginPath();
    ctx.arc(w - 180, 180, 80, 0, Math.PI * 2);
    ctx.fill();

    drawWaves(ctx, w, h, 'rgba(11, 79, 48, 0.08)', 6, 2);
    drawPalmTree(ctx, 60, h - 200, 0.8, 'rgba(11, 79, 48, 0.15)');
    drawPalmTree(ctx, w - 120, h - 200, 0.8, 'rgba(11, 79, 48, 0.15)');

  } else if (variantIndex === 1) {
    ctx.strokeStyle = 'rgba(11, 79, 48, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = 60; x < w - 60; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, h - 20); ctx.stroke();
    }
    for (let y = 60; y < h - 60; y += 60) {
      ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(w - 20, y); ctx.stroke();
    }
  } else {
    ctx.fillStyle = 'rgba(11, 79, 48, 0.04)';
    for (let x = 45; x < w - 45; x += 20) {
      for (let y = 45; y < h - 45; y += 20) {
        ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
      }
    }
    drawBarcode(ctx, w - 180, 40, 120, 30, 'rgba(10, 46, 29, 0.45)');
    
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.2)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, h - 140); ctx.lineTo(140, h - 40);
    ctx.moveTo(40, h - 120); ctx.lineTo(120, h - 40);
    ctx.stroke();
  }

  // Corner marks
  const drawCornerStar = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = primaryBorder;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.quadraticCurveTo(0, 0, 12, 0);
    ctx.quadraticCurveTo(0, 0, 0, 12);
    ctx.quadraticCurveTo(0, 0, -12, 0);
    ctx.quadraticCurveTo(0, 0, 0, -12);
    ctx.fill();
    ctx.restore();
  };

  const drawCornerCrosshair = (x: number, y: number) => {
    ctx.save();
    ctx.strokeStyle = primaryBorder;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 15, y); ctx.lineTo(x + 15, y);
    ctx.moveTo(x, y - 15); ctx.lineTo(x, y + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  if (variantIndex === 0 || variantIndex === 2) {
    drawCornerStar(50, 50);
    drawCornerStar(w - 50, 50);
    drawCornerStar(50, h - 50);
    drawCornerStar(w - 50, h - 50);
  } else {
    drawCornerCrosshair(60, 60);
    drawCornerCrosshair(w - 60, 60);
    drawCornerCrosshair(60, h - 60);
    drawCornerCrosshair(w - 60, h - 60);
  }

  // Top event banner micro-header
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = textPrimary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (variantIndex === 0) {
    ctx.fillText('✦ HH GOA BUILDER SQUAD ✦', w / 2, 70);
  } else if (variantIndex === 1) {
    ctx.fillText('[ HH GOA 2026 // SQUAD EDITION ]', w / 2, 70);
  } else {
    ctx.fillText('⚡ SQUAD VERIFIED // HACKER SQUAD ⚡', w / 2, 70);
  }

  // Helper to draw a circular emblem with segmented status ring
  const drawEmblem = (cx: number, cy: number, r: number, member: any, isLeftRight: boolean) => {
    ctx.save();
    ctx.lineWidth = isLeftRight ? 7 : 5;
    const arcRadius = r + (isLeftRight ? 18 : 12);

    // Segmented arcs
    let col1 = yellow, col2 = pink, col3 = green, col4 = dark;
    if (variantIndex === 1) {
      col1 = dark; col2 = yellow; col3 = green; col4 = dark;
    } else if (variantIndex === 2) {
      col1 = pink; col2 = yellow; col3 = dark; col4 = pink;
    }

    ctx.strokeStyle = col1;
    ctx.beginPath(); ctx.arc(cx, cy, arcRadius, -Math.PI * 0.95, -Math.PI * 0.55); ctx.stroke();
    ctx.strokeStyle = col2;
    ctx.beginPath(); ctx.arc(cx, cy, arcRadius, -Math.PI * 0.45, -Math.PI * 0.05); ctx.stroke();
    ctx.strokeStyle = col3;
    ctx.beginPath(); ctx.arc(cx, cy, arcRadius, Math.PI * 0.05, Math.PI * 0.45); ctx.stroke();
    ctx.strokeStyle = col4;
    ctx.beginPath(); ctx.arc(cx, cy, arcRadius, Math.PI * 0.55, Math.PI * 0.95); ctx.stroke();
    ctx.restore();

    // Shadow
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(cx + 6, cy + 6, r, 0, Math.PI * 2);
    ctx.fill();

    // Emblem rings
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    let ring1 = yellow;
    let ring2 = pink;
    if (variantIndex === 1) {
      ring1 = cream;
      ring2 = green;
    } else if (variantIndex === 2) {
      ring1 = pink;
      ring2 = yellow;
    }

    ctx.fillStyle = ring1;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = ring2;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 15, 0, Math.PI * 2);
    ctx.clip();

    const mImg = images[member.id];
    if (mImg) {
      drawUserImage(ctx, mImg, cx - (r - 15), cy - (r - 15), (r - 15) * 2, (r - 15) * 2, member.cropSettings || { zoom: 1.0, panX: 0, panY: 0 });
    } else {
      ctx.fillStyle = '#c5d1c9';
      ctx.fillRect(cx - (r - 15), cy - (r - 15), (r - 15) * 2, (r - 15) * 2);
    }
    ctx.restore();
  };

  // 2. Overlapping Circle Collage
  const members = crew.members || [];
  let maxAvatarBottom = 710;

  if (members.length === 1) {
    const cx = w / 2;
    const cy = 440;
    const r = 270;
    
    drawEmblem(cx, cy, r, members[0], true);
    maxAvatarBottom = cy + r;

  } else if (members.length === 2) {
    const r = 200;
    const cy = 440;
    const cx1 = w / 2 - 130; // 410
    const cx2 = w / 2 + 130; // 670

    drawEmblem(cx1, cy, r, members[0], true);
    drawEmblem(cx2, cy, r, members[1], true);
    maxAvatarBottom = cy + r;

  } else {
    const r = 170;
    const cx1 = 540; // Top Center
    const cy1 = 340;
    const cx2 = 400; // Bottom Left
    const cy2 = 530;
    const cx3 = 680; // Bottom Right
    const cy3 = 530;

    drawEmblem(cx1, cy1, r, members[0], false);
    drawEmblem(cx2, cy2, r, members[1], false);
    drawEmblem(cx3, cy3, r, members[2], false);
    maxAvatarBottom = cy3 + r;
  }

  // Attach branding stamp badge
  ctx.save();
  ctx.translate(w / 2 + 200, 480);
  ctx.rotate(0.08);
  ctx.fillStyle = pink;
  ctx.beginPath();
  ctx.roundRect(-85, -22, 170, 44, 8);
  ctx.fill();
  ctx.strokeStyle = dark;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = yellow;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (variantIndex === 1) {
    ctx.fillText("GOA '26", 0, 0);
  } else {
    ctx.fillText('CREW • 2026', 0, 0);
  }
  ctx.restore();

  // 3. Compact Overlapping Name Plate Box
  const plateW = 480;
  const plateH = 86;
  const plateX = w / 2 - plateW / 2;
  const plateY = maxAvatarBottom - 60;

  ctx.fillStyle = dark;
  ctx.fillRect(plateX + 8, plateY + 8, plateW, plateH);
  ctx.strokeRect(plateX + 8, plateY + 8, plateW, plateH);

  ctx.fillStyle = variantIndex === 1 ? cream : variantIndex === 2 ? yellow : cream;
  ctx.fillRect(plateX, plateY, plateW, plateH);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 4;
  ctx.strokeRect(plateX, plateY, plateW, plateH);

  const crewName = (crew.name || 'CREW NAME').toUpperCase();
  let nameSize = 42;
  ctx.font = `900 ${nameSize}px serif`;
  while (ctx.measureText(crewName).width > plateW - 40 && nameSize > 20) {
    nameSize -= 2;
    ctx.font = `900 ${nameSize}px serif`;
  }
  ctx.fillStyle = dark;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(crewName, w / 2, plateY + plateH / 2);

  // 4. Collective Tagline & Stack Tags below plate
  const taglineText = (crew.tagline || 'HH GOA BUILDER COLLECTIVE').toUpperCase();
  let taglineSize = 22;
  ctx.font = `bold ${taglineSize}px monospace`;
  while (ctx.measureText(taglineText).width > w - 120 && taglineSize > 14) {
    taglineSize -= 1;
    ctx.font = `bold ${taglineSize}px monospace`;
  }
  ctx.fillStyle = textSecondary;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(taglineText, w / 2, plateY + plateH + 45);

  const tags = crew.crewStack 
    ? crew.crewStack.split('•').map((s: string) => s.trim().toUpperCase()) 
    : ['REACT', 'NODE', 'AI'];
  
  ctx.font = 'bold 15px monospace';
  const tagPadd = 16;
  const tagH = 38;
  const tagGap = 12;
  
  const tagWidths = tags.map((t: string) => ctx.measureText(t).width + tagPadd * 2);
  const totalWidth = tagWidths.reduce((a: number, b: number) => a + b, 0) + tagGap * (tags.length - 1);
  
  let startX = w / 2 - totalWidth / 2;
  const tagY = plateY + plateH + 75;

  tags.forEach((t: string, idx: number) => {
    const tagW = tagWidths[idx];
    
    ctx.fillStyle = dark;
    ctx.fillRect(startX + 3, tagY + 3, tagW, tagH);
    ctx.strokeRect(startX + 3, tagY + 3, tagW, tagH);

    let tagBg = idx % 3 === 0 ? yellow : idx % 3 === 1 ? cream : pink;
    if (variantIndex === 1) {
      tagBg = idx % 2 === 0 ? cream : yellow;
    } else if (variantIndex === 2) {
      tagBg = idx % 2 === 0 ? pink : dark;
    }
    
    ctx.fillRect(startX, tagY, tagW, tagH);
    ctx.strokeStyle = dark;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(startX, tagY, tagW, tagH);

    if (variantIndex === 2 && idx % 2 === 1) {
      ctx.fillStyle = cream;
    } else if (tagBg === pink) {
      ctx.fillStyle = cream;
    } else {
      ctx.fillStyle = dark;
    }
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t, startX + tagW / 2, tagY + tagH / 2);

    startX += tagW + tagGap;
  });

  // Footer micro event info
  ctx.font = '900 13px monospace';
  ctx.fillStyle = pink;
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'center';
  if (variantIndex === 1) {
    ctx.fillStyle = green;
    ctx.fillText('OCT 2026 // SHIPPED AT THE BEACH', w / 2, h - 75);
  } else if (variantIndex === 2) {
    ctx.fillText('SERIAL // GOA-CREW-' + crew.code.substring(4) + ' // 5/5 SHIP', w / 2, h - 75);
  } else {
    ctx.fillText('OCT 28-31, 2026 // GOA READY', w / 2, h - 75);
  }
}
