let page = 'main';
const views = Array.from(document.querySelectorAll('.page'))
  .slice(1).map(s => s.id);

function renderState(id) {
  if (views.includes(window.location.hash.slice(1))) {
    document.getElementById(page).classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
    page = id;
    document.title = `${id[0].toUpperCase()}${id.slice(1)} \
      - ${document.title}`;
  } else {
    window.location.replace('/');
  }
}

if (window.location.hash) {
  renderState(window.location.hash.slice(1));
}

window.addEventListener('popstate', () => {
  if (window.location.hash) {
    renderState(window.location.hash.slice(1));
  } else {
    window.location.replace('/');
  }
});


const nav = document.querySelectorAll('nav button');
let active = 'sphere';
nav.forEach(btn => {
  btn.addEventListener('click', event => {
    if (event.target.value != active) {
      Array.from(nav).find(e => e.value == active).id = '';
      document.getElementById(active)
        .classList.add('hidden');
      event.target.id = 'active';
      document.getElementById(event.target.value)
        .classList.remove('hidden');
      active = event.target.value;
    }
  });
})


function range(start, end, step) {
  const len = Math.floor((end+step-start)/step);
  return Array(len).fill().map((_, e) => start+e*step)
}

class Manifold {
  constructor(id, w, h) {
    this.canvas = document.getElementById(`canvas-${id}`);
    this.canvas.width = w ? w*window.innerWidth : 0.5*window.innerWidth;
    this.canvas.height = h ? h*window.innerHeight : 0.8*window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);
    this.r = 0.25*this.canvas.width;
    this.t = 0;
    this.cam = Math.max(this.canvas.width, this.canvas.height);
  }

  project() {
    this.p = this.q.map(q_ => [
      0.5*this.canvas.width + this.cam*q_[0]/(this.cam-q_[2]),
      0.5*this.canvas.height + this.cam*q_[1]/(this.cam-q_[2]),
    ]);
    this.ctx.beginPath();
    for (let i=1; i < this.p.length; i+=2) {
      this.ctx.moveTo(this.p[i-1][0], this.p[i-1][1]);
      this.ctx.lineTo(this.p[i][0], this.p[i][1]);
    }
    this.ctx.lineWidth = 0.4;
    this.ctx.strokeStyle = '#007070';
    this.ctx.stroke();
  }
}

// moebius1
const moebius1 = new Manifold('moebius1', 0.6, 0.95);
setInterval(() => {
  moebius1.ctx.clearRect(
    0, 0, moebius1.canvas.width, moebius1.canvas.height
  );
  range(1, 25, 2).forEach(r_ => {
    r_ *= 0.01*moebius1.r;
    moebius1.q = [];
    range(0, 4*Math.PI, 0.01*Math.PI).forEach(phi => {
      const theta = moebius1.t+0.5*phi;
      moebius1.q.push([
        1.2*(moebius1.r + r_*Math.sin(theta))*Math.cos(phi),
        0.8*(moebius1.r + r_*Math.sin(theta))*Math.sin(phi),
        r_*Math.cos(theta),
      ]);
    });
    moebius1.project();
  });
  moebius1.t = moebius1.t%(2*Math.PI) + 0.005*Math.PI;
}, 16.67);

// sphere
const sphere = new Manifold('sphere');
setInterval(() => {
  sphere.ctx.clearRect(0, 0, sphere.canvas.width, sphere.canvas.height);
  range(0.01*Math.PI, 0.99*Math.PI, 0.02*Math.PI).forEach(theta => {
    sphere.q = [];
    range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
      sphere.q.push([
        sphere.r*Math.sin(theta)*Math.sin(sphere.t+phi),
        sphere.r*Math.cos(theta),
        sphere.r*Math.sin(theta)*Math.cos(sphere.t+phi),
      ])
    });
    sphere.project();
  });
  sphere.t = sphere.t%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);

// hyperboloid
const hyper = new Manifold('hyperboloid');
hyper.r *= 0.25;
setInterval(() => {
  hyper.ctx.clearRect(0, 0, hyper.canvas.width, hyper.canvas.height);
  range(-160, 160, 5).forEach(y => {
    hyper.q = [];
    range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
      hyper.q.push([
        Math.sqrt(y**2 + hyper.r**2)*Math.cos(hyper.t+phi),
        y,
        Math.sqrt(y**2 + hyper.r**2)*Math.sin(hyper.t+phi),
      ])
    });
    hyper.project();
  });
  hyper.t = hyper.t%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);

// torus
const torus = new Manifold('torus');
torus.r = [torus.r, 0.3*torus.r];
setInterval(() => {
  torus.ctx.clearRect(0, 0, torus.canvas.width, torus.canvas.height);
  range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
    torus.q = [];
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(theta => {
      [y, z] = [
        (torus.r[0] + torus.r[1]*Math.sin(theta))*Math.sin(torus.t+phi),
        torus.r[1]*Math.cos(theta),
      ];
      const rot = 0.36*Math.PI;
      torus.q.push([
        (torus.r[0] + torus.r[1]*Math.sin(theta))*Math.cos(torus.t+phi),
        y*Math.cos(rot) + z*Math.sin(rot),
        -y*Math.sin(rot) + z*Math.cos(rot),
      ])
    });
    torus.project();
  });
  torus.t = torus.t%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);

// moebius2
const moebius2 = new Manifold('moebius2');
setInterval(() => {
  moebius2.ctx.clearRect(
    0, 0, moebius2.canvas.width, moebius2.canvas.height
  );
  range(1, 25, 2).forEach(r_ => {
    r_ *= 0.01*moebius2.r;
    moebius2.q = [];
    range(0, 4*Math.PI, 0.01*Math.PI).forEach(phi => {
      const theta = moebius2.t+0.5*phi;
      moebius2.q.push([
        1.2*(moebius2.r + r_*Math.sin(theta))*Math.cos(phi),
        0.8*(moebius2.r + r_*Math.sin(theta))*Math.sin(phi),
        r_*Math.cos(theta),
      ]);
    });
    moebius2.project();
  });
  moebius2.t = moebius2.t%(2*Math.PI) + 0.005*Math.PI;
}, 16.67);
