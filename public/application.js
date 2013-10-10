var RGB = (function () {
  function RGB (r, g, b) {
    this.red   = r;
    this.green = g;
    this.blue  = b;
  }

  RGB.prototype.toArray = function () {
    return [this.red, this.green, this.blue];
  };

  RGB.prototype.toHexString = function () {
    return "#" + this.red.toString(16, 2) + this.green.toString(16) + this.blue.toString(16);
  };

  RGB.prototype.toRatio = function () {
    return this.toArray().map(function (i) { return i / 255 });
  };

  RGB.prototype.toRatioObject = function () {
    return {
      red:   this.red / 255,
      green: this.green / 255,
      blue:  this.blue / 255
    };
  }

  RGB.parse = function (str) {
    var m = str.match(/^rgba?\((.*)\)$/); // XXX
    if (!m) return;
    var rgbArray = m[1].split(/\s*,\s*/).map(function (i) { return parseInt(i) });
    var bindArgs = [null].concat(rgbArray);
    return new (this.bind.apply(this, bindArgs))()
  };

  return RGB;
})();

$(function () {
  (function (app) {
    var $app = $('#' + app);
    var $pre = $app.find('pre');
    var fg = RGB.parse($pre.css('color'));
    var bg = RGB.parse($pre.css('background-color'));
    var $bold = $pre.children('.bold');
    var $cursor = $pre.children('.cursor');
    var $selection = $pre.children('.selection');
    var boldColor = RGB.parse($bold.css('color'));
    var cursorColor = RGB.parse($cursor.css('background-color'));
    var cursorTextColor = RGB.parse($cursor.css('color'));
    var selectionColor = RGB.parse($selection.css('background-color'));
    var selectedTextColor = RGB.parse($selection.css('color'));
    var colors = $pre.children('[class^=fg-]'). // XXX
      map(function () { return RGB.parse($(this).css('color')) }).get();

    var template = _.template($app.find('.template').text());
    var rendered = template({
      foregroundColor: fg.toRatioObject(),
      backgroundColor: bg.toRatioObject(),
      ansiColors: colors.map(function (c) { return c.toRatioObject() }),
      boldColor: boldColor.toRatioObject(),
      cursorColor: cursorColor.toRatioObject(),
      cursorTextColor: cursorTextColor.toRatioObject(),
      selectedTextColor: selectedTextColor.toRatioObject(),
      selectionColor: selectionColor.toRatioObject()
    });

    $app.find('.output').text(rendered);
  })('iterm2');
})
