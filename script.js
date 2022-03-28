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



const width = 0.6*window.innerWidth;
const height = 1.0*window.innerHeight;
document.querySelectorAll('canvas').forEach(c => {
  c.width = width;
  c.height = height;
})

function range(start, end, step) {
  const len = Math.floor((end+step-start)/step);
  return Array(len).fill().map((_, e) => start+e*step)
}

function stereographic_projection(q, ctx) {
  const d = Math.max(width, height);
  let p = q.map(q_ => [
    0.5*width + d*q_[0]/(d-q_[2]),
    0.5*height + d*q_[1]/(d-q_[2])
  ]);
  ctx.beginPath();
  for (let i=1; i < p.length; i+=2) {
    ctx.moveTo(p[i-1][0], p[i-1][1]);
    ctx.lineTo(p[i][0], p[i][1]);
  }
  ctx.lineWidth = 0.4;
  ctx.strokeStyle = '#007070';
  ctx.stroke();
}

// moebius
Array.from(['moebius1', 'moebius2']).forEach(moebius_ => {
  const moebius = document.getElementById(moebius_);
  const moebius_ctx = moebius.getContext('2d');
  const r1a = 0.25*width;
  let t1 = 0;
  setInterval(() => {
    moebius_ctx.clearRect(0, 0, width, height);
    range(1, 25, 2).forEach(r1b => {
      r1b *= 0.01*r1a;
      let q = [];
      range(0, 4*Math.PI, 0.01*Math.PI).forEach(phi => {
        const theta = t1+0.5*phi;
        q.push([
          1.2*(r1a - r1b*Math.sin(theta))*Math.cos(phi),
          -0.8*(r1a - r1b*Math.sin(theta))*Math.sin(phi),
          r1b*Math.cos(theta)
        ]);
      });
      stereographic_projection(q, moebius_ctx);
    });
    t1 = t1%(2*Math.PI) + 0.005*Math.PI;
  }, 16.67);
});

// sphere
const sphere = document.getElementById('sphere');
const sphere_ctx = sphere.getContext('2d');
const r2 = 0.25*width;
let t2 = 0;
setInterval(() => {
  sphere_ctx.clearRect(0, 0, width, height);
  range(0.01*Math.PI, 0.99*Math.PI, 0.01*Math.PI).forEach(theta => {
    let q = [];
    range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
      q.push([
        r2*Math.sin(theta)*Math.sin(t2+phi),
        r2*Math.cos(theta),
        r2*Math.sin(theta)*Math.cos(t2+phi)
      ])
    });
    stereographic_projection(q, sphere_ctx);
  });
  t2 = t2%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);

// hyperboloid
const hyper = document.getElementById('hyperboloid');
const hyper_ctx = hyper.getContext('2d');
const r3 = 0.1*width;
let t3 = 0;
setInterval(() => {
  hyper_ctx.clearRect(0, 0, width, height);
  range(-200, 200, 4).forEach(z => {
    let q = [];
    range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
      q.push([
        Math.sqrt(z**2 + r3**2)*Math.cos(t3+phi),
        z,
        Math.sqrt(z**2 + r3**2)*Math.sin(t3+phi)
      ])
    });
    stereographic_projection(q, hyper_ctx);
  });
  t3 = t3%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);

// torus
const torus = document.getElementById('torus');
const torus_ctx = torus.getContext('2d');
const r4a = 0.25*width;
const r4b = 0.3*r4a;
let t4 = 0;
// setInterval(() => {
//   torus_ctx.clearRect(0, 0, width, height);
//   range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
//     let q = [];
//     range(0, 2*Math.PI, 0.02*Math.PI).forEach(theta => {
//       [x, z] = [
//         (r4a + r4b*Math.sin(theta))*Math.sin(t4+phi),
//         r4b*Math.cos(theta),
//       ];
//       const rot = 0.3*Math.PI;
//       q.push([
//         (r4a + r4b*Math.sin(theta))*Math.cos(t4+phi),
//         x*Math.cos(rot) - z*Math.sin(rot),
//         x*Math.sin(rot) + z*Math.cos(rot),
//       ])
//     });
//     stereographic_projection(q, torus_ctx);
//   });
//   t4 = t4%(2*Math.PI) + 0.001*Math.PI;
// }, 16.67);
