function geodesic(z1) {
  const r = 100; // dynamic
  let phi = 0;
  let x = [[], [], []];
  const theta = 0.4*Math.PI;
  while (phi < 2*Math.PI) {
    x[0].push(r*Math.cos(phi));
    x[1].push(r*Math.sin(phi)*Math.cos(theta) - z1*Math.sin(theta));
    x[2].push(r*Math.sin(phi)*Math.sin(theta) + z1*Math.cos(theta));
    phi += 0.01;
  }
  return x;
}

function projection(x) {
  const o = [canvas.width/2, canvas.height/2];
  let y = [[], []];
  i = 0;
  while (i < x[0].length) {
    y[0].push(o[0] + 300*x[0][i]/(120-x[2][i]));
    y[1].push(o[1]/2 + 200*x[1][i]/(120-x[2][i]));
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
  c.lineWidth = 0.2;
  c.strokeStyle = '#777';
  c.stroke();
}

const canvas = document.getElementById('anim');
canvas.width = window.innerWidth;
canvas.height = 0.8*window.innerHeight;
if (canvas.getContext('2d')) {
  const c = canvas.getContext('2d');
  [15, 5, -5, -15].forEach(z => plot(c, projection(geodesic(z))));

} else {

}
