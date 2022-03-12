function geodesic(z1) {
  const r = 100; // dynamic
  let phi = 0;
  const theta = Math.PI/4;
  let x = [[], [], []];
  while (phi < 2*Math.PI) {
    x[0].push(r*Math.cos(phi));
    x[1].push(r*Math.sin(phi));
    x[2].push(z1);
    phi += 0.02;
  }
  return x;
}

function projection(x) {
  const o = [canvas.width/2, canvas.height/2];
  let y = [[], []];
  i = 0;
  while (i < x[0].length) {
    y[0].push(o[0] + x[0][i]/(1-x[2][i]));
    y[1].push(o[1] + x[1][i]/(1-x[2][i]));
    i++;
  };
  return y;
}

function plot(c, x) {
  c.beginPath();
  for (i=1; i < x[0].length; i++) {
    c.moveTo(x[0][i-1], x[1][i-1]);
    c.lineTo(x[0][i], x[1][i]);
  }
  c.lineWidth = 0.4;
  c.strokeStyle = '#444';
  c.stroke();
}

const canvas = document.getElementById('anim');
canvas.width = window.innerWidth;
canvas.height = 0.8*window.innerHeight;
if (canvas.getContext('2d')) {
  const c = canvas.getContext('2d');
  [0.4, 0.5, 0.6].forEach(z => plot(c, projection(geodesic(z))));

} else {

}
