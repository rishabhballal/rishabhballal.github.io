const canvas = document.getElementById('anim');
canvas.width = window.innerWidth;
canvas.height = 0.8*window.innerHeight;
if (canvas.getContext('2d')) {
  const ctx = canvas.getContext('2d');

  // geodesics
  const r1 = 0.25*Math.max(canvas.width, canvas.height);
  [1,3].forEach(r2 => {
    r2 *= 0.06*r1;
    let phi = 0;
    let theta = 0;
    let q = [];
    let x, y, z;
    while (phi <= 4*Math.PI) {
      theta = 0.5*phi;
      // curve on the 2-torus
      x = (r1 + r2*Math.sin(theta))*Math.cos(phi);
      y = (r1 + r2*Math.sin(theta))*Math.sin(phi);
      z = r2*Math.cos(theta);
      // rotate about x-axis for orientation ?
      q.push([x, y, z]);
      phi += 0.01*Math.PI;
    }
    // projection
    const o = [0.5*canvas.width, 0.5*canvas.height];
    let p = [];
    let a, b;
    let i = 0;
    while (i < q.length) {
      a = o[0] + 0.8*r1*q[i][0]/(r1-q[i][2]);
      b = o[1] + 0.5*r1*q[i][1]/(r1-q[i][2]);
      p.push([a, b]);
      i++;
    };
    // animation
    ctx.beginPath();
    for (i=1; i < p.length; i++) {
      ctx.moveTo(p[i-1][0], p[i-1][1]);
      ctx.lineTo(p[i][0], p[i][1]);
    }
    ctx.lineWidth = 0.2;
    ctx.strokeStyle = '#444';
    ctx.stroke();
  });

} else {

}
