goog.provide('pl.retained.Element');

goog.require('goog.color.alpha');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');

/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number=} opt_x
 * @param {number=} opt_y
 * @param {boolean=} opt_enableCache
 */
pl.retained.Element = function(width, height, opt_x, opt_y, opt_enableCache) {
  this.width = width;
  this.height = height;
  this.x = opt_x || 0;
  this.y = opt_y || 0;

  if (opt_enableCache) {
    this._drawInternal = pl.retained.Element.prototype._drawCached;
  }
};

/**
 * @param {!CanvasRenderingContext2D} ctx
 **/
pl.retained.Element.prototype.draw = goog.abstractMethod;

/**
 * @returns {!goog.math.Coordinate}
 */
pl.retained.Element.prototype.getTopLeft = function() {
  return new goog.math.Coordinate(this.x, this.y);
};

/**
 * @param {number} x
 * @param {number} y
 */
pl.retained.Element.prototype.setTopLeft = function(x, y) {
  this.x = x;
  this.y = y;
};

pl.retained.Element.prototype.getBounds = function() {
  return new goog.math.Rect(this.x, this.y, this.width, this.height);
};

pl.retained.Element.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};

/**
 * @param {goog.math.Size} size
 * @returns {boolean}
 */
pl.retained.Element.prototype.setSize = function(size) {
  if (!goog.math.Size.equals(this.getSize(), size)) {
    this.width = size.width;
    this.height = size.height;
    this._lastDrawSize = null;
    return true;
  }
  return false;
};

/**
 * @private
 * @param {!CanvasRenderingContext2D} ctx
 **/
pl.retained.Element.prototype._drawCore = function(ctx) {
  if (this.fillStyle) {
    ctx.save();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  if (goog.isDef(this.alpha)) {
    ctx.globalAlpha = this.alpha;
  }

  // call the abstract draw method
  this.draw(ctx);
};

/**
 * @private
 * @param {!CanvasRenderingContext2D} ctx
 **/
pl.retained.Element.prototype._drawNormal = function(ctx) {
  ctx.save();

  // Translate to the starting position
  ctx.translate(this.x, this.y);

  // clip to the bounds of the object
  ctx.beginPath();
  ctx.rect(0, 0, this.width, this.height);
  ctx.clip();

  this._drawCore(ctx);
  ctx.restore();
};

/**
 * @private
 * @param {!CanvasRenderingContext2D} ctx
 **/
pl.retained.Element.prototype._drawCached = function(ctx) {
  if (!this._cacheCanvas || !goog.math.Size.equals(pl.ex.getCanvasSize(this._cacheCanvas), this._lastDrawSize)) {
    if (!this._cacheCanvas) {
      this._cacheCanvas =
      /** @type {!HTMLCanvasElement} */
      document.createElement('canvas');
    }
    this._cacheCanvas.width = this.width;
    this._cacheCanvas.height = this.height;

    var cacheCtx =
    /** @type {!CanvasRenderingContext2D} */
    this._cacheCanvas.getContext('2d');

    this._drawCore(cacheCtx);
  }
  ctx.drawImage(this._cacheCanvas, this.x, this.y);
  this._lastDrawSize = this.getSize();
};

/**
 * @private
 * @param {!CanvasRenderingContext2D} ctx
 **/
pl.retained.Element.prototype._drawInternal = pl.retained.Element.prototype._drawNormal;