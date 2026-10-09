// ============================================================
// VEXILLO — globeRenderer2d.js
// Renderer globe 2D bergaya Profile (digunakan Explore & Quiz)
// ============================================================

const LAND_POLYGONS = [
  // North America
  [[-168,71],[-140,72],[-100,73],[-85,70],[-60,65],[-55,47],[-67,44],[-70,42],[-75,35],[-80,25],[-90,15],[-85,10],[-80,8],[-77,8],[-76,9],[-72,12],[-68,12],[-62,10],[-60,8],[-55,6],[-52,4],[-50,5],[-53,6],[-58,7],[-62,8],[-63,10],[-65,18],[-68,20],[-72,22],[-75,20],[-83,10],[-85,10],[-90,15],[-100,20],[-105,20],[-110,23],[-118,32],[-122,37],[-124,40],[-124,48],[-130,54],[-140,59],[-148,60],[-155,59],[-162,60],[-168,62],[-168,71]],
  // South America
  [[-80,8],[-76,2],[-72,-2],[-70,-10],[-75,-15],[-72,-20],[-68,-22],[-65,-25],[-65,-35],[-68,-42],[-65,-50],[-68,-55],[-63,-52],[-58,-52],[-55,-50],[-50,-28],[-48,-20],[-45,-10],[-40,-5],[-35,-5],[-35,-8],[-38,-12],[-42,-22],[-45,-28],[-48,-28],[-50,-30],[-52,-33],[-55,-38],[-60,-40],[-62,-45],[-65,-47],[-65,-52],[-68,-55],[-70,-55],[-72,-50],[-72,-45],[-70,-40],[-68,-35],[-65,-30],[-62,-22],[-58,-15],[-55,-8],[-50,-2],[-48,0],[-50,4],[-55,6],[-58,7],[-62,8],[-65,10],[-68,12],[-72,12],[-76,9],[-80,8]],
  // Europe
  [[0,51],[5,53],[10,55],[15,57],[20,60],[25,62],[30,65],[28,70],[20,70],[15,70],[10,63],[5,62],[0,58],[-5,55],[-8,52],[-5,48],[0,46],[5,44],[10,44],[15,42],[18,40],[22,38],[26,36],[28,36],[30,38],[30,40],[28,42],[30,45],[25,46],[20,48],[15,50],[10,52],[5,50],[0,51]],
  // Africa
  [[-5,36],[0,36],[5,37],[10,37],[15,37],[20,37],[25,36],[30,34],[33,30],[35,25],[37,20],[42,12],[45,10],[48,10],[50,8],[45,2],[40,-2],[40,-10],[35,-18],[33,-25],[28,-30],[25,-35],[20,-35],[18,-33],[17,-30],[15,-25],[12,-18],[10,-10],[8,-2],[5,5],[2,5],[0,5],[-3,5],[-5,5],[-8,4],[-12,4],[-15,10],[-15,15],[-15,20],[-10,28],[-8,32],[-5,34],[-5,36]],
  // Asia
  [[30,65],[35,70],[40,72],[50,72],[60,73],[70,72],[80,73],[90,72],[100,70],[110,68],[120,65],[130,60],[135,55],[140,48],[140,40],[135,35],[130,32],[125,28],[120,22],[115,20],[110,18],[105,10],[100,5],[95,2],[90,0],[85,-2],[80,5],[75,8],[70,12],[65,20],[60,25],[55,28],[50,30],[45,35],[40,38],[35,40],[30,45],[28,50],[30,55],[30,60],[30,65]],
  // Australia
  [[115,-22],[120,-20],[125,-15],[130,-12],[135,-12],[140,-15],[145,-18],[148,-22],[150,-25],[152,-28],[153,-30],[152,-35],[150,-38],[148,-38],[145,-38],[140,-36],[135,-35],[130,-32],[125,-30],[120,-28],[115,-28],[113,-25],[113,-22],[115,-22]],
  // Greenland
  [[-50,83],[-40,83],[-25,82],[-20,80],[-18,76],[-22,72],[-28,68],[-35,65],[-45,60],[-52,62],[-55,68],[-55,75],[-50,80],[-50,83]],
  // Indonesia
  [[95,5],[100,3],[105,2],[110,-2],[115,-5],[120,-8],[125,-8],[128,-6],[130,-4],[128,-2],[125,-1],[120,0],[115,2],[110,4],[105,5],[100,5],[95,5]],
];

function toXYZ(lon, lat, rotDeg, R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + rotDeg) * (Math.PI / 180);
  return {
    x: R * Math.sin(phi) * Math.cos(theta),
    y: -R * Math.cos(phi),
    z: R * Math.sin(phi) * Math.sin(theta),
  };
}

export function drawProfileStyleGlobe(ctx, W, H, rot, tick, cx, cy, R, stars) {
  // Background luar angkasa fullscreen
  const bg = ctx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H));
  bg.addColorStop(0, '#050f20');
  bg.addColorStop(1, '#020a12');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Bintang
  for (const s of stars) {
    const twinkled = s.o * (0.7 + 0.3 * Math.sin(s.twinkle + tick * 0.8));
    ctx.beginPath();
    ctx.arc((s.x / 100) * W, (s.y / 100) * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(190,215,255,${twinkled.toFixed(2)})`;
    ctx.fill();
  }

  // Atmosphere
  const atm = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.28);
  atm.addColorStop(0, 'rgba(30,90,180,0.12)');
  atm.addColorStop(0.6, 'rgba(20,60,140,0.05)');
  atm.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2);
  ctx.fillStyle = atm;
  ctx.fill();

  // Ocean base
  const ocean = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.05, cx, cy, R);
  ocean.addColorStop(0, '#1c3f6e');
  ocean.addColorStop(0.35, '#102a50');
  ocean.addColorStop(0.7, '#081b38');
  ocean.addColorStop(1, '#050e20');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = ocean;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  const rotDeg = rot * (180 / Math.PI);

  // Grid lines
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(96,165,250,0.10)';

  for (let lat = -80; lat <= 80; lat += 20) {
    ctx.beginPath();
    let first = true;
    for (let lon = -180; lon <= 180; lon += 3) {
      const p = toXYZ(lon, lat, rotDeg, R);
      if (p.z < 0) { first = true; continue; }
      const px = cx + p.x, py = cy + p.y;
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  for (let lon = -180; lon < 180; lon += 20) {
    ctx.beginPath();
    let first = true;
    for (let lat = -90; lat <= 90; lat += 3) {
      const p = toXYZ(lon, lat, rotDeg, R);
      if (p.z < 0) { first = true; continue; }
      const px = cx + p.x, py = cy + p.y;
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  // Land masses
  for (const poly of LAND_POLYGONS) {
    ctx.beginPath();
    let drawing = false;
    for (const [lon, lat] of poly) {
      const p = toXYZ(lon, lat, rotDeg, R);
      const px = cx + p.x, py = cy + p.y;
      if (p.z < 0) { drawing = false; continue; }
      if (!drawing) { ctx.moveTo(px, py); drawing = true; }
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(59,130,246,0.22)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(96,165,250,0.40)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Specular highlight
  const spec = ctx.createRadialGradient(
    cx - R * 0.32, cy - R * 0.32, R * 0.02,
    cx - R * 0.1, cy - R * 0.1, R * 0.7
  );
  spec.addColorStop(0, 'rgba(255,255,255,0.09)');
  spec.addColorStop(0.5, 'rgba(255,255,255,0.02)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = spec;
  ctx.fill();

  ctx.restore();

  // Edge ring
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(96,165,250,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();
}