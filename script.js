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
history.replaceState({'page': state}, '', '');

function transition(state1, state2) {
  let opacity = 100;
  const speed = 10;
  const int1 = setInterval(() => {
    opacity -= speed;
    state1.style.opacity = opacity*0.01;
    if (opacity <= 0) {
      state1.classList.add('hidden');
      clearInterval(int1);
      state2.style.opacity = opacity;
      state2.classList.remove('hidden');
      const int2 = setInterval(() => {
        opacity += speed;
        state2.style.opacity = opacity*0.01;
        if (opacity >= 100) clearInterval(int2);
      }, 16.67)
    }
  }, 16.67)
  state = state2.id;
}

document.querySelectorAll('nav .btn').forEach(btn =>
  btn.addEventListener('click', e => {
    transition(document.getElementById('main'),
      document.getElementById(btn.value));
    history.pushState({'page': btn.value}, '', '');
  })
);

window.addEventListener('popstate', event => {
  if (event.state.page) transition(document.getElementById(state),
    document.getElementById(event.state.page));
});
