// Benutztes Eis (Textur für «Eis aufbereiten» im Hero).

/**
 * Benutztes Eis nach einem Training als vorgerechnetes SVG (beim Build, keine Laufzeitkosten, kein Textur-Tausch):
 * wolkiger Schneestaub (an den Rändern dichter), feines Korn, viele leicht gebogene Kufenspuren und weiche
 * Schneehäufchen. Nahtlos kachelbar (Elemente am Rand werden um eine Kachel versetzt wiederholt), fester Seed.
 */
export function eisTexturDaten(): string {
  const W = 960;
  const H = 480;
  let seed = 1993;
  const rnd = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const z = (a: number, b: number) => a + (b - a) * rnd();
  const f = (n: number) => n.toFixed(1);
  const teile: string[] = [];
  // nur dort wiederholen, wo ein Element über den Kachelrand ragt
  const kachel = (x0: number, y0: number, x1: number, y1: number, zeichne: (dx: number, dy: number) => string) => {
    for (const dx of [-W, 0, W])
      for (const dy of [-H, 0, H]) {
        if (x1 + dx < 0 || x0 + dx > W || y1 + dy < 0 || y0 + dy > H) continue;
        teile.push(zeichne(dx, dy));
      }
  };
  // 1) Schneestaub
  for (let i = 0; i < 70; i++) {
    const x = rnd() * W;
    const y = rnd() < 0.55 ? (rnd() < 0.5 ? z(0, H * 0.18) : z(H * 0.82, H)) : rnd() * H;
    const rx = z(40, 170);
    const ry = rx * z(0.25, 0.6);
    const a = z(0.25, 0.6);
    kachel(x - rx, y - ry, x + rx, y + ry, (dx, dy) => `<ellipse cx='${f(x + dx)}' cy='${f(y + dy)}' rx='${f(rx)}' ry='${f(ry)}' fill='url(#s)' opacity='${a.toFixed(2)}'/>`);
  }
  // 2) Kufenspuren: feine Rille und weisser Abrieb
  for (let i = 0; i < 120; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const w = rnd() < 0.72 ? z(-0.28, 0.28) : z(-1.1, 1.1);
    const len = z(90, 520);
    const bogen = z(-0.35, 0.35) * len * 0.25;
    const ex = Math.cos(w) * len;
    const ey = Math.sin(w) * len;
    const cx = ex / 2 - Math.sin(w) * bogen;
    const cy = ey / 2 + Math.cos(w) * bogen;
    const a = z(0.25, 0.6);
    const b = z(0.5, 1.4);
    const xs = [x, x + cx, x + ex];
    const ys = [y, y + cy, y + ey];
    kachel(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (dx, dy) => {
      const d = (o: number) => `M${f(x + dx)} ${f(y + dy + o)}Q${f(x + dx + cx)} ${f(y + dy + cy + o)} ${f(x + dx + ex)} ${f(y + dy + ey + o)}`;
      return `<path d='${d(0.8)}' stroke='rgb(95,110,125)' stroke-opacity='${(a * 0.22).toFixed(2)}' stroke-width='${f(b * 0.7)}'/><path d='${d(0)}' stroke='#fff' stroke-opacity='${a.toFixed(2)}' stroke-width='${f(b)}'/>`;
    });
  }
  // 3) weiche Schneehäufchen an Bremsstellen
  for (let i = 0; i < 26; i++) {
    const x = rnd() * W;
    const y = rnd() < 0.6 ? (rnd() < 0.5 ? z(H * 0.04, H * 0.28) : z(H * 0.72, H * 0.96)) : rnd() * H;
    const r = z(10, 26);
    const rx = r * z(1.3, 2.4);
    const a = z(0.22, 0.4);
    kachel(x - rx, y - r, x + rx, y + r, (dx, dy) => `<ellipse cx='${f(x + dx)}' cy='${f(y + dy)}' rx='${f(rx)}' ry='${f(r)}' fill='url(#s)' opacity='${a.toFixed(2)}'/>`);
  }
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'>` +
    `<defs><radialGradient id='s'><stop offset='0' stop-color='#fff'/><stop offset='.55' stop-color='#fafcfd' stop-opacity='.55'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></radialGradient>` +
    `<filter id='k' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='1' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 9 0 0 0 -5.6'/></filter></defs>` +
    `<rect width='${W}' height='${H}' filter='url(#k)' opacity='.55'/>` +
    `<g fill='none' stroke-linecap='round'>${teile.join('')}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
