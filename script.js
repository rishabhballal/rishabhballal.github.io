class Manifold {
  constructor(id, scale=[0.6, 0.45]) {
    this.canvas = document.getElementById(`canvas-${id}`);
    console.log(window.innerWidth)
    if (window.innerWidth > 768) {
      this.canvas.width = scale[0]*window.innerWidth;
      this.canvas.height = scale[1]*window.innerHeight;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = 0.6*window.innerWidth;
    }
    this.ctx = this.canvas.getContext('2d');
    this.ctx.translate(0.45*this.canvas.width, 0.6*this.canvas.height);
    this.ctx.scale(1, -1);
    this.q = [];
    this.r = 0.24*this.canvas.width;
    this.cam = 4*this.r;
  }

  rotate(axis, angle) {
    angle *= Math.PI;
    this.q = this.q.map(q => {
      let x = ['x', 'y', 'z'];
      const i = x.indexOf(axis);
      x[i] = q[i];
      x[(i+1)%3] = q[(i+1)%3]*Math.cos(angle) - q[(i+2)%3]*Math.sin(angle);
      x[(i+2)%3] = q[(i+1)%3]*Math.sin(angle) + q[(i+2)%3]*Math.cos(angle);
      return x;
    });
  }

  project() {
    this.p = this.q.map(q_ => [
      (this.cam/(this.cam-q_[2]))*q_[0],
      (this.cam/(this.cam-q_[2]))*q_[1],
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

const moebius = new Manifold('moebius');
moebiusEqn(moebius, 0.36*Math.PI);
moebius.rotate('x', 0.36);
moebius.project();
