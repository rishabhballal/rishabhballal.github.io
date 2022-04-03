class Manifold {
  constructor(id, dim=[0.5, 0.8]) {
    this.canvas = document.getElementById(`canvas-${id}`);
    this.canvas.width = dim[0]*window.innerWidth;
    this.canvas.height = dim[1]*window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(0.5*this.canvas.width, 0.5*this.canvas.height);
    this.ctx.scale(1, -1);
    this.q = [];
    this.r = 0.25*this.canvas.width;
    this.cam = this.canvas.width;
  }

  rotate(axis, angle) {
    // create generic algorithm
    angle *= Math.PI;
    this.q = this.q.map(q => {
      switch (axis) {
        case 'x':
        return [
          q[0],
          q[1]*Math.cos(angle) - q[2]*Math.sin(angle),
          q[1]*Math.sin(angle) + q[2]*Math.cos(angle),
        ];
        break;
        case 'y':
        return [
          q[2]*Math.sin(angle) + q[0]*Math.cos(angle),
          q[1],
          q[2]*Math.cos(angle) - q[0]*Math.sin(angle),
        ];
        break;
        case 'z':
        return [
          q[0]*Math.cos(angle) - q[1]*Math.sin(angle),
          q[0]*Math.sin(angle) + q[1]*Math.cos(angle),
          q[2],
        ];
        break;
      }
    });
  }

  project() {
    this.p = this.q.map(q_ => [
      this.cam*q_[0]/(this.cam-q_[2]),
      this.cam*q_[1]/(this.cam-q_[2]),
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

function range(start, end, step) {
  const len = Math.round((end-start)/step);
  return Array(len).fill().map((_, e) => start+e*step)
}

function moebiusEqn(obj, phase) {
  range(1, 25, 2).forEach(r_ => {
    r_ *= 0.01*obj.r;
    range(0, 4*Math.PI, 0.01*Math.PI).forEach(phi => {
      obj.q.push([
        1.2*(obj.r + r_*Math.sin(0.5*phi+phase))*Math.cos(phi),
        0.8*(obj.r + r_*Math.sin(0.5*phi+phase))*Math.sin(phi),
        r_*Math.cos(0.5*phi+phase),
      ]);
    });
  });
}

function sphereEqn(obj) {
  range(0.02*Math.PI, Math.PI, 0.02*Math.PI).forEach(theta => {
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(phi => {
      obj.q.push([
        obj.r*Math.sin(theta)*Math.cos(phi),
        obj.r*Math.sin(theta)*Math.sin(phi),
        obj.r*Math.cos(theta),
      ]);
    });
  });
}

function hyperEqn(obj) {
  range(-160, 160, 5).forEach(z => {
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(phi => {
      obj.q.push([
        Math.sqrt(z**2 + obj.r**2)*Math.cos(phi),
        Math.sqrt(z**2 + obj.r**2)*Math.sin(phi),
        z,
      ]);
    });
  });
}

function torusEqn(obj) {
  range(0, 2*Math.PI, 0.02*Math.PI).forEach(phi => {
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(theta => {
      obj.q.push([
        (obj.r[0] + obj.r[1]*Math.sin(theta))*Math.sin(phi),
        (obj.r[0] + obj.r[1]*Math.sin(theta))*Math.cos(phi),
        obj.r[1]*Math.cos(theta),
      ]);
    });
  });
}

const moebius1 = new Manifold('moebius1', [0.6, 0.95]);
let t = 0;
const interval = setInterval(() => {
  moebius1.ctx.clearRect(
    -0.5*moebius1.canvas.width,
    -0.5*moebius1.canvas.height,
    moebius1.canvas.width,
    moebius1.canvas.height
  );
  moebius1.q = [];
  moebiusEqn(moebius1, t);
  moebius1.project();
  t = t%(2*Math.PI) + 0.006*Math.PI;
}, 20);

const sphere = new Manifold('sphere');
sphereEqn(sphere);
sphere.rotate('x', 0.64);
sphere.project();

const hyper = new Manifold('hyperboloid');
hyper.r *= 0.3;
hyperEqn(hyper);
hyper.rotate('x', 0.5);
hyper.project();

const torus = new Manifold('torus');
torus.r = [torus.r, 0.3*torus.r];
torusEqn(torus);
torus.rotate('x', 0.64);
torus.project();

const moebius2 = new Manifold('moebius2');
moebiusEqn(moebius2, 0.36*Math.PI);
moebius2.rotate('x', 0.36);
moebius2.rotate('z', 1);
moebius2.project();

let page = 'main';
const views = Array.from(document.querySelectorAll('.page'))
  .slice(1).map(s => s.id);

function renderPage(id) {
  if (views.includes(window.location.hash.slice(1))) {
    document.getElementById(page).classList.add('hidden');
    clearInterval(interval);
    document.getElementById(id).classList.remove('hidden');
    const title = id[0].toUpperCase().concat(id.slice(1)).split('-').join(' ');
    document.title = `${title} - Rishabh Ballal`;

    if (id == 'geometry') {
      let active = document.getElementById('active').value;
      const nav = document.querySelectorAll('nav button');
      document.getElementById(active).classList.remove('hidden');
      nav.forEach(btn => {
        btn.addEventListener('click', e => {
          if (event.target.value != active) {
            Array.from(nav).find(i => i.value == active).id = '';
            e.target.id = 'active';
            document.getElementById(active).classList.add('hidden');
            document.getElementById(e.target.value).classList.remove('hidden');
            active = e.target.value;
          }
        });
      });
    }
    page = id;
  } else {
    window.location.replace('/');
  }
}

if (window.location.hash) {
  renderPage(window.location.hash.slice(1));
} else {
  document.getElementById('main').classList.remove('hidden');
}

window.addEventListener('popstate', () => {
  if (window.location.hash) {
    renderPage(window.location.hash.slice(1));
  } else {
    window.location.replace('/');
  }
});
