document.querySelectorAll('canvas').forEach(c => {
  c.width = 0.6*window.innerWidth;
  c.height = window.innerHeight;
})

const canvas = document.getElementById('moebius1');
const ctx = canvas.getContext('2d');
const r1 = 0.25*canvas.width;
let t0 = 0;
setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Array(12).fill().map((_, i) => 2*i+1).forEach(r2 => {
    r2 *= 0.01*r1;
    let q = [];
    Array(401).fill().map((_, e) => 0.01*e*Math.PI).forEach(phi => {
      const theta = t0+0.5*phi;
      q.push([
        (r1 - r2*Math.sin(theta))*Math.cos(phi),
        -(r1 - r2*Math.sin(theta))*Math.sin(phi),
        r2*Math.cos(theta)
      ]);
    });
    let p = q.map(q_ => [
      0.5*canvas.width + 1.2*r1*q_[0]/(r1-q_[2]),
      0.5*canvas.height + 0.8*r1*q_[1]/(r1-q_[2])
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
  t0 = t0%(2*Math.PI) + 0.005*Math.PI;
}, 16.67);



let state = 'main';
const views = ['geometry', 'physics'];

function renderState(id) {
  if (views.includes(window.location.hash.slice(1))) {
    document.getElementById(state).classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
    state = id;
  } else {
    window.location.replace('/');
  }
}

if (window.location.hash) {
  renderState(window.location.hash.slice(1));
}

document.querySelectorAll('nav .btn').forEach(btn =>
  btn.addEventListener('click', e => {
    window.location.hash = btn.value;
  })
);

window.addEventListener('hashchange', () => {
  renderState(window.location.hash.slice(1));
});

window.addEventListener('popstate', () => {
  if (window.location.hash) {
    renderState(window.location.hash.slice(1));
  } else {
    window.location.replace('/');
  }
});
