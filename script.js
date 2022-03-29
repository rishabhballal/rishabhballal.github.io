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




function range(start, end, step) {
  const len = Math.floor((end+step-start)/step);
  return Array(len).fill().map((_, e) => start+e*step)
}

class Manifold {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.canvas.width = 0.6*window.innerWidth;
    this.canvas.height = 1.0*window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);
    this.r = 0.25*this.canvas.width;
    this.t = 0;
    this.cam = Math.max(this.canvas.width, this.canvas.height);
  }

  project(s) {
    this.p = this.q.map(q_ => [
      0.5*this.canvas.width + s[0]*this.cam*q_[0]/(this.cam-q_[2]),
      0.5*this.canvas.height + s[1]*this.cam*q_[1]/(this.cam-q_[2])
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

// moebius
['moebius1', 'moebius2'].forEach(moebius_ => {
  const moebius = new Manifold(moebius_);
  setInterval(() => {
    moebius.ctx.clearRect(
      0, 0, moebius.canvas.width, moebius.canvas.height
    );
    range(1, 25, 2).forEach(r_ => {
      r_ *= 0.01*moebius.r;
      moebius.q = [];
      range(0, 4*Math.PI, 0.01*Math.PI).forEach(phi => {
        const theta = moebius.t+0.5*phi;
        moebius.q.push([
          (moebius.r + r_*Math.sin(theta))*Math.cos(phi),
          (moebius.r + r_*Math.sin(theta))*Math.sin(phi),
          r_*Math.cos(theta)
        ]);
      });
      moebius.project([1.2, 0.8]);
    });
    moebius.t = moebius.t%(2*Math.PI) + 0.005*Math.PI;
  }, 16.67);
});

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
        sphere.r*Math.sin(theta)*Math.cos(sphere.t+phi)
      ])
    });
    sphere.project([1.2, 1.2]);
  });
  sphere.t = sphere.t%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);

// hyperboloid
const hyper = new Manifold('hyperboloid');
hyper.r *= 0.5;
setInterval(() => {
  hyper.ctx.clearRect(0, 0, hyper.canvas.width, hyper.canvas.height);
  range(-200, 200, 5).forEach(y => {
    hyper.q = [];
    range(0, 2*Math.PI, 0.01*Math.PI).forEach(phi => {
      hyper.q.push([
        Math.sqrt(y**2 + hyper.r**2)*Math.cos(hyper.t+phi),
        y,
        Math.sqrt(y**2 + hyper.r**2)*Math.sin(hyper.t+phi)
      ])
    });
    hyper.project([1.2, 1.2]);
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
        torus.r[1]*Math.cos(theta)
      ];
      const rot = 0.25*Math.PI;
      torus.q.push([
        (torus.r[0] + torus.r[1]*Math.sin(theta))*Math.cos(torus.t+phi),
        y*Math.cos(rot) + z*Math.sin(rot),
        -y*Math.sin(rot) + z*Math.cos(rot)
      ])
    });
    torus.project([1.2, 1.2]);
  });
  torus.t = torus.t%(2*Math.PI) + 0.001*Math.PI;
}, 16.67);
