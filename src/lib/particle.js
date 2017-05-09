/**
 * Created by geeku on 08/05/2017.
 */
class Particle {
  constructor (el, options) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    if (this.el.tagName !== 'CANVAS') {
      throw new TypeError('canvas element is required.');
    }

    this.width = this.el.width = options.width * 2|| 300;
    this.height = this.el.height = options.height * 2 || 100;

    this.ctx = this.el.getContext('2d');

    this.colors = [[255, 255, 255]];
    this.opacity = options.opacity || .5;
    this.maxCircle = options.maxCircle || 100;

    this.circleList = [];

    this._options = options;

    this.init();
  }

  init () {
    for (let i = 0; i < this.maxCircle; i++) {
      this.createCircle();
    }
    this.render();
  }

  render () {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateCircle();
    this.drawCircleList();
    requestAnimationFrame(this.render.bind(this));
  }

  updateCircle () {
    this.circleList.forEach(circle => {
      circle.x += circle.vx;
      circle.y += circle.vy;
      circle.radius += .05;
      circle.opacity = ((this.height - circle.y) / this.height);

      // circle.vx = this.random(-2, 2);
      if (circle.x > (this.width + circle.radius)) {
        circle.x = -circle.radius;
        // circle.vx = this.random(0, 5);
      }
      if (circle.y > (this.height + circle.radius)) {
        // circle.y = -circle.radius;
        // circle.vy = this.random(0, 5);
      }
      if (circle.x < -circle.radius) {
        circle.x = this.width + circle.radius;
        // circle.vx = this.random(-5, -1);
      }
      if (circle.y < -circle.radius) {
        circle.y = this.height + circle.radius;
        circle.vy = -this.random(1, 5, true);
        circle.radius = this.random(5, 10);
        circle.opacity = .1;
      }
    });
  }
  createCircle () {
    const circle = {
      x: this.random(0, this.width),
      y: this.random(0, this.height),
      // y: this.height,
      // vx: Math.pow(-1, this.random(1, 2)) * this.random(1, 2),
      // vy: Math.pow(-1, this.random(1, 2)) * this.random(1, 2),
      vx: this.random(-2, 2, true),
      vy: -this.random(1, 3, true),
      color: this.colors[this.random(0, this.colors.length - 1)],
      radius: this.random(5, 10),
      opacity: .1
    }

    this.circleList.push(circle);
  }

  drawCircleList () {
    this.circleList.forEach(circle => this.drawCircle(circle));
  }
  drawCircle ({ x = 0, y = 0, radius = 10, color = this.colors[0], opacity = .1 }) {
    this.ctx.fillStyle = `rgba(${color.join(',')}, ${opacity})`;
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fill();
  }

  random (start = 0, end = 10, withDec = false) {
    const random = Math.round(Math.random() * (end - start) + start);
    return withDec ? random : ~~random;
  }
}

export default Particle;
