function range(start, end, step) {
  const len = Math.round((end+step-start)/step);
  return Array(len).fill().map((_, e) => start+e*step)
}

class Manifold {
  constructor(id, dim=[0.5, 0.8], display=false) {
    this.canvas = document.getElementById(`canvas-${id}`);
    this.canvas.width = dim[0]*window.innerWidth;
    this.canvas.height = dim[1]*window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);
    this.r = 0.25*this.canvas.width;
    this.t = 0;
    this.cam = Math.max(this.canvas.width, this.canvas.height);
    this.display = display;
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

  animate(eqn, inc) {
    setInterval(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.display) {
        eqn(this);
        this.t = this.t%(2*Math.PI) + inc*Math.PI;
      }
    }, 16.67);
  }
}

function moebiusEqn(obj) {
  range(1, 25, 2).forEach(r_ => {
    r_ *= 0.01*obj.r;
    obj.q = [];
    range(0, 4*Math.PI, 0.01*Math.PI).forEach(phi => {
      const theta = obj.t+0.5*phi;
      obj.q.push([
        1.2*(obj.r + r_*Math.sin(theta))*Math.cos(phi),
        0.8*(obj.r + r_*Math.sin(theta))*Math.sin(phi),
        r_*Math.cos(theta),
      ]);
    });
    obj.project();
  });
}

function sphereEqn(obj) {
  range(0.01*Math.PI, 0.99*Math.PI, 0.02*Math.PI).forEach(theta => {
    obj.q = [];
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(phi => {
      obj.q.push([
        obj.r*Math.sin(theta)*Math.sin(obj.t+phi),
        obj.r*Math.cos(theta),
        obj.r*Math.sin(theta)*Math.cos(obj.t+phi),
      ])
    });
    obj.project();
  });
}

function hyperEqn(obj) {
  range(-160, 160, 5).forEach(y => {
    obj.q = [];
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(phi => {
      obj.q.push([
        Math.sqrt(y**2 + obj.r**2)*Math.cos(obj.t+phi),
        y,
        Math.sqrt(y**2 + obj.r**2)*Math.sin(obj.t+phi),
      ])
    });
    obj.project();
  });
}

function torusEqn(obj) {
  range(0, 1.98*Math.PI, 0.02*Math.PI).forEach(phi => {
    obj.q = [];
    range(0, 2*Math.PI, 0.02*Math.PI).forEach(theta => {
      [y, z] = [
        (obj.r[0] + obj.r[1]*Math.sin(theta))*Math.sin(obj.t+phi),
        obj.r[1]*Math.cos(theta),
      ];
      const rot = 0.36*Math.PI;
      obj.q.push([
        (obj.r[0] + obj.r[1]*Math.sin(theta))*Math.cos(obj.t+phi),
        y*Math.cos(rot) + z*Math.sin(rot),
        -y*Math.sin(rot) + z*Math.cos(rot),
      ])
    });
    obj.project();
  });
}

const moebius1 = new Manifold('moebius1', [0.6, 0.95], true);
moebius1.animate(moebiusEqn, 0.005);

const sphere = new Manifold('sphere');
sphere.animate(sphereEqn, 0.001);

const hyper = new Manifold('hyperboloid');
hyper.r *= 0.3;
hyper.animate(hyperEqn, 0.001);

const torus = new Manifold('torus');
torus.r = [torus.r, 0.3*torus.r];
torus.animate(torusEqn, 0.001);

const moebius2 = new Manifold('moebius2');
moebius2.animate(moebiusEqn, 0.005);

let page = 'main';
const views = Array.from(document.querySelectorAll('.page'))
  .slice(1).map(s => s.id);

function renderPage(id) {
  if (views.includes(window.location.hash.slice(1))) {
    document.getElementById(page).classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
    if (page == 'main') moebius1.display = false;
    page = id;
    // document.title

    switch (page) {
      case 'geometry':
      let active = 'sphere';
      sphere.display = true;
      const nav = document.querySelectorAll('nav button');
      nav.forEach(btn => {
        btn.addEventListener('click', e => {
          if (event.target.value != active) {
            Array.from(nav).find(i => i.value == active).id = '';
            e.target.id = 'active';
            document.getElementById(active).classList.add('hidden');
            document.getElementById(e.target.value).classList.remove('hidden');
            // create array of Manifold instances
            [sphere, hyper, torus, moebius2]
              .find(c => c.canvas.id == `canvas-${active}`).display = false;
            [sphere, hyper, torus, moebius2]
              .find(c => c.canvas.id == `canvas-${e.target.value}`).display = true;
            active = e.target.value;
          }
        });
      });
      break;
      case 'geometry-code':

      break;
    }
  } else {
    window.location.replace('/');
  }
}

if (window.location.hash) {
  renderPage(window.location.hash.slice(1));
}

window.addEventListener('popstate', () => {
  if (window.location.hash) {
    renderPage(window.location.hash.slice(1));
  } else {
    window.location.replace('/');
  }
});
