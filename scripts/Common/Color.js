Color = function (r, g, b, a) {
    if (typeof a === 'undefined') {
        this.a = 1;
    } else {
        this.a = a;
    }
    this.r = r;
    if (typeof g === 'undefined' && typeof b === 'undefined') {
        this.g = r;
        this.b = r;
    } else {
        this.g = g;
        this.b = b;
    }
};

Color.prototype.add = function (color) {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;
    this.a += color.a;
};

Color.prototype.multiply = function (mag) {
    if (mag instanceof Color) {
        this.r = Math.floor((this.r * mag.r) / 255);
        this.g = Math.floor((this.g * mag.g) / 255);
        this.b = Math.floor((this.b * mag.b) / 255);
        this.a = Math.floor((this.a * mag.a));
    } else {
        this.r *= mag;
        this.g *= mag;
        this.b *= mag;
        this.a *= mag;
    }
};

Color.prototype.a255 = function () {
    return this.a * 255;
};

Color.prototype.copy = function () {
    return new Color(this.r, this.g, this.b, this.a);
};

Color.prototype.interpolate = function (color, mag) {
    var restMag = 1 - mag;
    this.r = parseInt((this.r * restMag) + (color.r * mag));
    this.b = parseInt((this.b * restMag) + (color.b * mag));
    this.g = parseInt((this.g * restMag) + (color.g * mag));
    this.a = parseInt((this.a * restMag) + (color.a * mag));
};

Color.prototype.bestBlackWhite = function () {
    var sum = this.r + this.b + this.g;
    return sum <= 383 ? new Color(255) : new Color(0);
};

Color.prototype.toString = function () {
    return "(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
};