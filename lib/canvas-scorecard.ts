import { RoastResult } from './types';

/**
 * Native HTML5 Canvas 2D Scorecard Generator (1080x1350 vertical poster resolution)
 * Renders an ultra-sharp dark-mode neo-brutalist trading card for WhatsApp / Reddit / Instagram.
 */
export async function generateScorecardCanvasPng(
  roast: RoastResult,
  personaName: string,
  candidateName: string = 'Candidate'
): Promise<string> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    throw new Error('Canvas scorecard generation is only supported in the browser.');
  }

  const width = 1080;
  const height = 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get 2D canvas context');
  }

  // 1. Background Fill
  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, width, height);

  // Subtle radial gradient in the center
  const radialGlow = ctx.createRadialGradient(width / 2, height / 3, 50, width / 2, height / 3, 600);
  radialGlow.addColorStop(0, 'rgba(249, 115, 22, 0.12)');
  radialGlow.addColorStop(1, 'rgba(9, 9, 11, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // Subtle dot grid
  ctx.fillStyle = 'rgba(63, 63, 70, 0.25)';
  for (let x = 40; x < width - 40; x += 40) {
    for (let y = 40; y < height - 40; y += 40) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // 2. Outer Card Container (with rounded corners and neon orange border)
  const pad = 60;
  const cardW = width - pad * 2;
  const cardH = height - pad * 2;
  const cardR = 32;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(pad, pad, cardW, cardH, cardR);
  ctx.fillStyle = '#111115';
  ctx.fill();

  // Neon orange outline
  ctx.strokeStyle = '#F97316';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(249, 115, 22, 0.5)';
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.restore();

  // 3. Top Header inside card
  const contentX = pad + 48;
  const contentW = cardW - 96;
  let cursorY = pad + 60;

  // Header Brand row
  ctx.fillStyle = '#F97316';
  ctx.fillRect(contentX, cursorY, 36, 36);

  // Flame inside box
  ctx.fillStyle = '#09090B';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥', contentX + 18, cursorY + 26);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.font = '800 28px Inter, sans-serif';
  ctx.fillText('CookedResume.in', contentX + 50, cursorY + 26);

  ctx.fillStyle = '#71717A';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText('/ DAMAGE REPORT', contentX + 310, cursorY + 25);

  // Top Right: Persona Badge
  ctx.textAlign = 'right';
  ctx.fillStyle = '#F97316';
  ctx.font = '600 16px "IBM Plex Mono", monospace';
  ctx.fillText(`ROASTED BY: ${personaName.toUpperCase()}`, contentX + contentW, cursorY + 25);

  cursorY += 60;

  // Divider line
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(contentX, cursorY);
  ctx.lineTo(contentX + contentW, cursorY);
  ctx.stroke();

  cursorY += 40;

  // Candidate Sub-header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '600 18px "IBM Plex Mono", monospace';
  ctx.fillText(`SUBJECT: ${candidateName.toUpperCase()}`, contentX, cursorY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#71717A';
  ctx.font = '16px "IBM Plex Mono", monospace';
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  ctx.fillText(`DATE: ${today}`, contentX + contentW, cursorY);

  cursorY += 50;

  // 4. Centerpiece: Massive Circular Progress Ring
  const centerX = width / 2;
  const centerY = cursorY + 110;
  const circleRadius = 110;

  // Background Ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 18;
  ctx.stroke();

  // Progress Arc
  const pct = Math.min(Math.max(roast.cookedPercentage, 0), 100);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (pct / 100) * (Math.PI * 2);

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, startAngle, endAngle);
  ctx.strokeStyle = '#F97316';
  ctx.lineWidth = 18;
  ctx.lineCap = 'round';
  ctx.shadowColor = '#F97316';
  ctx.shadowBlur = 30;
  ctx.stroke();
  ctx.restore();

  // Inner Text
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FAFAFA';
  ctx.font = '800 68px "IBM Plex Mono", monospace';
  ctx.fillText(`${pct}%`, centerX, centerY + 15);

  ctx.fillStyle = '#F97316';
  ctx.font = 'bold 18px "IBM Plex Mono", monospace';
  ctx.fillText('COOKED', centerX, centerY + 45);

  cursorY = centerY + circleRadius + 45;

  // Verdict Badge
  const verdict = roast.verdictBadge || roast.verdictTitle || 'CERTIFIED TUTORIAL HELL';
  ctx.save();
  ctx.font = '800 24px Inter, sans-serif';
  const textWidth = ctx.measureText(`“ ${verdict} ”`).width;
  const badgeW = Math.max(textWidth + 48, 380);
  const badgeH = 50;
  const badgeX = centerX - badgeW / 2;
  const badgeY = cursorY;

  ctx.fillStyle = '#18181B';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
  ctx.fill();
  ctx.strokeStyle = '#3F3F46';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FAFAFA';
  ctx.textAlign = 'center';
  ctx.fillText(`“ ${verdict} ”`, centerX, badgeY + 34);
  ctx.restore();

  cursorY += 80;

  // 5. 2-Column Monospace Metric Box
  const metricBoxW = (contentW - 24) / 2;
  const metricBoxH = 90;

  // Left Box: Predicted CTC
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.roundRect(contentX, cursorY, metricBoxW, metricBoxH, 14);
  ctx.fill();
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#71717A';
  ctx.font = '600 14px "IBM Plex Mono", monospace';
  ctx.fillText('PREDICTED CTC', contentX + 24, cursorY + 32);

  ctx.fillStyle = '#F97316';
  ctx.font = '800 24px "IBM Plex Mono", monospace';
  ctx.fillText(roast.predictedCTC || roast.predictedPackage || '₹3.36 LPA', contentX + 24, cursorY + 66);

  // Right Box: Delusion Level
  const rightBoxX = contentX + metricBoxW + 24;
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.roundRect(rightBoxX, cursorY, metricBoxW, metricBoxH, 14);
  ctx.fill();
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#71717A';
  ctx.font = '600 14px "IBM Plex Mono", monospace';
  ctx.fillText('DELUSION LEVEL', rightBoxX + 24, cursorY + 32);

  ctx.fillStyle = '#EF4444';
  ctx.font = '800 24px "IBM Plex Mono", monospace';
  ctx.fillText(roast.delusionLevel || 'EXTREME', rightBoxX + 24, cursorY + 66);

  cursorY += 120;

  // 6. Red Flags Section
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '700 14px "IBM Plex Mono", monospace';
  ctx.fillText('CRITICAL RED FLAGS (03)', contentX, cursorY);

  cursorY += 24;

  const flags = roast.redFlags.slice(0, 3);
  flags.forEach((flag) => {
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.roundRect(contentX, cursorY, contentW, 52, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('❌', contentX + 16, cursorY + 32);

    ctx.fillStyle = '#D4D4D8';
    ctx.font = '500 16px Inter, sans-serif';
    const truncatedFlag = flag.length > 75 ? flag.slice(0, 72) + '...' : flag;
    ctx.fillText(truncatedFlag, contentX + 50, cursorY + 32);

    cursorY += 62;
  });

  // 7. Watermark Footer inside the card
  const footerY = pad + cardH - 36;
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(contentX, footerY - 24);
  ctx.lineTo(contentX + contentW, footerY - 24);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FAFAFA';
  ctx.font = 'bold 16px "IBM Plex Mono", monospace';
  ctx.fillText('cookedresume.in', contentX, footerY);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#71717A';
  ctx.font = '14px "IBM Plex Mono", monospace';
  ctx.fillText('Roast Your Tech Resume • 100% Client-Side', contentX + contentW, footerY);

  return canvas.toDataURL('image/png');
}
