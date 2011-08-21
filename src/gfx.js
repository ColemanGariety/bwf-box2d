goog.provide('pl.gfx');

goog.require('goog.math.Size');

/**
 * @param {string|CanvasGradient|CanvasPattern} fill
 */
pl.gfx.fillCircle = function(ctx, x, y, radius, fill) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

// 2011-08-17
// Discovered here: http://stackoverflow.com/questions/4478742/html5-canvas-can-i-somehow-use-linefeeds-in-filltext
// Inspired by: http://stackoverflow.com/users/128165/gaby-aka-g-petrioli
// Created by: http://stackoverflow.com/users/791890/jeffchan
// Copied from: http://jsfiddle.net/jeffchan/WHgaY/76/
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} lineHeight
 * @param {number} fitWidth
 * @param {boolean=} opt_measureOnly
 */
pl.gfx.multiFillText = function(ctx, text, x, y, lineHeight, fitWidth, opt_measureOnly) {
  var measureOnly = Boolean(opt_measureOnly);

  text = text.replace(/(\r\n|\n\r|\r|\n)/g, "\n");
  var sections = text.split("\n");

  var i, index, str, wordWidth, words, currentLine = 0,
    maxHeight = 0,
    maxWidth = 0;

  var printNextLine = function(str) {
    if (!measureOnly) {
      ctx.fillText(str, x, y + (lineHeight * currentLine));
    }

    currentLine++;
    wordWidth = ctx.measureText(str).width;
    if (wordWidth > maxWidth) {
      maxWidth = wordWidth;
    }
  };

  for (i = 0; i < sections.length; i++) {
    words = sections[i].split(' ');
    index = 1;

    while (words.length > 0 && index <= words.length) {

      str = words.slice(0, index).join(' ');
      wordWidth = ctx.measureText(str).width;

      if (wordWidth > fitWidth) {
        if (index === 1) {
          // Falls to this case if the first word in words[] is bigger than fitWidth
          // so we print this word on its own line; index = 2 because slice is
          str = words.slice(0, 1).join(' ');
          words = words.splice(1);
        } else {
          str = words.slice(0, index - 1).join(' ');
          words = words.splice(index - 1);
        }

        printNextLine(str);

        index = 1;
      } else {
        index++;
      }
    }

    // The left over words on the last line
    if (index > 0) {
      printNextLine(words.join(' '));
    }

  }

  maxHeight = lineHeight * (currentLine);

  return new goog.math.Size(maxWidth, maxHeight);
};