const canvas = document.getElementById('anim');
canvas.width = window.innerWidth;
canvas.height = 0.8*window.innerHeight;
const ctx = canvas.getContext('2d');

const r1 = 0.25*Math.max(canvas.width, canvas.height);
const inf = 0.01*Math.PI;
let t0 = 0;
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Array(12).fill().map((_, i) => 2*i+1).forEach(r2 => {
    r2 *= 0.01*r1;
    let q = [];
    Array(401).fill().map((_, e) => 0.01*e*Math.PI).forEach(i => {
      [theta, phi] = [t0+0.5*i, i];
      q.push([
        (r1 - r2*Math.sin(theta))*Math.cos(phi),
        -(r1 - r2*Math.sin(theta))*Math.sin(phi),
        r2*Math.cos(theta)
      ]);
    });
    const o = [0.5*canvas.width, 0.5*canvas.height];
    const scale = [0.75, 0.5];
    let p = q.map(q_ => [
      o[0] + scale[0]*r1*q_[0]/(r1-q_[2]),
      o[1] + scale[1]*r1*q_[1]/(r1-q_[2])
    ]);
    ctx.beginPath();
    for (let i=1; i < p.length; i+=2) {
      ctx.moveTo(p[i-1][0], p[i-1][1]);
      ctx.lineTo(p[i][0], p[i][1]);
    }
    ctx.lineWidth = 0.4;
    ctx.strokeStyle = '#007070';
    ctx.stroke();
  });
  t0 += 0.5*inf;
}, 16.67);
