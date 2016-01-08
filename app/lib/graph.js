var Graphemescope, requestAnimFrame, timer;

requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    timer = setTimeout(callback, 1000 / 30);
    return timer;
  };
})();

window.Graphemescope = Graphemescope = (function() {
  function Graphemescope(parentElement) {
    this.parentElement = parentElement != null ? parentElement : window.document.body;
    this.enabled = true;
    this.radiusFactor = 1.0;
    this.zoomFactor = 1.0;
    this.angleFactor = 0.0;
    this.zoomTarget = 1.2;
    this.angleTarget = 0.8;
    this.easeEnabled = true;
    this.ease = 0.1;
    if (this.domElement == null) {
      this.domElement = document.createElement("canvas");
    }
    if (this.ctx == null) {
      this.ctx = this.domElement.getContext("2d");
    }
    this.alphaFactor = 1.0;
    this.alphaTarget = 1.0;
    this.parentElement.appendChild(this.domElement);
    this.oldResizeHandler = function() {};
    if (window.onresize !== null) {
      this.oldResizeHandler = window.onresize;
    }
    window.onresize = (function(_this) {
      return function() {
        return _this.resizeHandler();
      };
    })(this);
    this.resizeHandler();
    requestAnimFrame((function(_this) {
      return function() {
        return _this.animationFrame();
      };
    })(this));
  }

  Graphemescope.prototype.animationFrame = function() {
    requestAnimFrame((function(_this) {
      return function() {
        return _this.animationFrame();
      };
    })(this));
    if (this.enabled) {
      this.update();
      return this.draw();
    }
  };

  Graphemescope.prototype.resizeHandler = function() {
    this.width = this.domElement.width = this.parentElement.offsetWidth;
    this.height = this.domElement.height = this.parentElement.offsetHeight;
    this.radius = 0.5 * this.radiusFactor * Math.min(this.width, this.height);
    this.radiusHeight = 0.5 * Math.sqrt(3) * this.radius;
    return this.oldResizeHandler();
  };

  Graphemescope.prototype.update = function() {
    if (this.easeEnabled) {
      this.angleFactor += (this.angleTarget - this.angleFactor) * this.ease;
      this.zoomFactor += (this.zoomTarget - this.zoomFactor) * this.ease;
      return this.alphaFactor += (this.alphaTarget - this.alphaFactor) * this.ease;
    } else {
      this.angleFactor = this.angleTarget;
      this.zoomFactor = this.zoomTarget;
      return this.alphaFactor = this.alphaTarget;
    }
  };


  Graphemescope.prototype.cancelAnimation = function(){
    if (timer){
      clearTimeout(timer);
    }
    
    window.cancelAnimationFrame();
  };

  Graphemescope.prototype.drawImage = function(image) {
    var outerRadius, zoom;
    this.ctx.save();
    outerRadius = 2 / 3 * this.radiusHeight;
    zoom = this.zoomFactor * outerRadius / (0.5 * Math.min(image.width, image.height));
    this.ctx.translate(0, outerRadius);
    this.ctx.scale(zoom, zoom);
    this.ctx.rotate(this.angleFactor * 2 * Math.PI);
    this.ctx.translate(-0.5 * image.width, -0.5 * image.height);
    this.ctx.fill();
    return this.ctx.restore();
  };

  Graphemescope.prototype.drawCell = function(image) {
    var cellIndex, i, results;
    results = [];
    for (cellIndex = i = 0; i < 6; cellIndex = ++i) {
      this.ctx.save();
      this.ctx.rotate(cellIndex * 2.0 * Math.PI / 6.0);
      this.ctx.scale([-1, 1][cellIndex % 2], 1);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(-0.5 * this.radius, 1.0 * this.radiusHeight);
      this.ctx.lineTo(0.5 * this.radius, 1.0 * this.radiusHeight);
      this.ctx.closePath();
      this.drawImage(image);
      results.push(this.ctx.restore());
    }
    return results;
  };

  Graphemescope.prototype.drawLayer = function(image) {
    var h, horizontalLimit, horizontalStrype, i, j, k, l, len, len1, ref, ref1, results, results1, v, verticalLimit, verticalStrype;
    this.ctx.save();
    this.ctx.translate(0.5 * this.width, 0.5 * this.height);
    verticalLimit = Math.ceil(0.5 * this.height / this.radiusHeight);
    horizontalLimit = Math.ceil(0.5 * this.width / (3 * this.radius));
    horizontalStrype = (function() {
      results = [];
      for (var i = ref = -horizontalLimit; ref <= horizontalLimit ? i <= horizontalLimit : i >= horizontalLimit; ref <= horizontalLimit ? i++ : i--){ results.push(i); }
      return results;
    }).apply(this);
    verticalStrype = (function() {
      results1 = [];
      for (var j = ref1 = -verticalLimit; ref1 <= verticalLimit ? j <= verticalLimit : j >= verticalLimit; ref1 <= verticalLimit ? j++ : j--){ results1.push(j); }
      return results1;
    }).apply(this);
    for (k = 0, len = verticalStrype.length; k < len; k++) {
      v = verticalStrype[k];
      this.ctx.save();
      this.ctx.translate(0, this.radiusHeight * v);
      if (Math.abs(v) % 2) {
        this.ctx.translate(1.5 * this.radius, 0);
      }
      for (l = 0, len1 = horizontalStrype.length; l < len1; l++) {
        h = horizontalStrype[l];
        this.ctx.save();
        this.ctx.translate(3 * h * this.radius, 0);
        this.drawCell(image);
        this.ctx.restore();
      }
      this.ctx.restore();
    }
    return this.ctx.restore();
  };

  Graphemescope.prototype.draw = function() {
    if (this.imageProxy != null) {
      this.ctx.fillStyle = this.patternProxy;
      this.ctx.globalAlpha = 1 - this.alphaFactor;
      this.drawLayer(this.imageProxy);
    }
    if (this.image != null) {
      this.ctx.fillStyle = this.pattern;
      this.ctx.globalAlpha = this.alphaFactor;
      return this.drawLayer(this.image);
    }
  };

  Graphemescope.prototype.setImageDirect = function(image) {
    if (this.image != null) {
      this.imageProxy = this.image;
      this.patternProxy = this.pattern;
    }
    this.image = image;
    this.pattern = this.ctx.createPattern(this.image, "repeat");
    return this.alphaFactor = 0.0;
  };

  Graphemescope.prototype.setImage = function(image) {
    var imageElement;
    if (typeof image === "string") {
      imageElement = new Image();
      imageElement.src = image;
      return imageElement.onload = (function(_this) {
        return function() {
          return _this.setImageDirect(imageElement);
        };
      })(this);
    } else {
      return this.setImageDirect(image);
    }
  };

  return Graphemescope;

})();