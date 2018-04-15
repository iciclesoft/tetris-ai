CanvasRenderingContext2D.prototype.showStroke = false;
CanvasRenderingContext2D.prototype.showFill = false;
Math.twoPI = 2 * Math.PI;

CanvasRenderingContext2D.prototype.draw = function (path) {
    if (this.showStroke) {
        if (path) {
            this.stroke(path);
        } else {
            this.stroke();
        }
    }
    if (this.showFill) {
        if (path) {
            this.fill(path);
        } else {
            this.fill();
        }
    }
};

CanvasRenderingContext2D.prototype.fillColor = function (r, g, b, a) {
    if (typeof g === 'undefined' && typeof b === 'undefined') {
        g = r;
        b = r;
    }
    if (typeof a === 'undefined') {
        this.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
    } else {
        this.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }
};

CanvasRenderingContext2D.prototype.strokeColor = function (r, g, b, a) {
    if (typeof g === 'undefined' && typeof b === 'undefined') {
        g = r;
        b = r;
    }
    if (typeof a === 'undefined') {
        this.strokeStyle = "rgb(" + r + ", " + g + ", " + b + ")";
    } else {
        this.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }
};

CanvasRenderingContext2D.prototype.vLine = function (startVector, endVector) {
    this.beginPath();
    this.moveTo(startVector.x, startVector.y);
    this.lineTo(endVector.x, endVector.y);
    this.closePath();
    this.draw();
};

CanvasRenderingContext2D.prototype.line = function (startX, startY, endX, endY) {
    if (typeof endX === 'undefined' && typeof endY === 'undefined') {
        // Assume we're drawing a line between 2 vectors
        this.vLine(startX, startY);
        return;
    }
    this.beginPath();
    this.moveTo(startX, startY);
    this.lineTo(endX, endY);
    this.closePath();
    this.draw();
};

CanvasRenderingContext2D.prototype.easEllipse = function (x, y, r) {
    this.beginPath();
    this.ellipse(x, y, r, r, 0, 0, Math.twoPI);
    this.closePath();
    this.draw();
};

CanvasRenderingContext2D.prototype.rect = function (x, y, w, h) {
    if (this.showStroke) {
        this.strokeRect(x, y, w, h);
    }
    if (this.showFill) {
        this.fillRect(x, y, w, h);
    }
};

CanvasRenderingContext2D.prototype.block3D = function (x, y, w, h, color) {
    // Draw the base
    this.fillColor(color.r, color.g, color.b, color.a);
    this.rect(x, y, w, h);
    var bWH = (w + h) * .1;
    // Draw the highlight
    var highlight = color.copy();
    highlight.interpolate(new Color(255), .4);
    this.fillColor(highlight.r, highlight.g, highlight.b, 1);
    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(x + w, y);
    this.lineTo(x + w, y + h);
    this.lineTo(x + w - bWH, y + h - bWH);
    this.lineTo(x + w - bWH, y + bWH);
    this.lineTo(x + bWH, y + bWH);
    this.lineTo(x, y);
    this.closePath();
    this.draw();
    // Draw the shadow
    var shadow = color.copy();
    shadow.interpolate(new Color(0), .2);
    this.fillColor(shadow.r, shadow.g, shadow.b, 1);
    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(x + bWH, y + bWH);
    this.lineTo(x + bWH, y + h - bWH);
    this.lineTo(x + w - bWH, y + h - bWH);
    this.lineTo(x + w, y + h);
    this.lineTo(x, y + h);
    this.lineTo(x, y);
    this.closePath();
    this.draw();
};

/**
 * Calculates the power of the base component by a given exponent, surpassing imaginary numbers.
 * It does so by getting the absolute value of the given numbers.
 * If both numbers are positive or zero, or both numbers are negative, a positive value is returned.
 * Otherwise, a negative value is returned.
 * For more information on the default Math.pow-function, see http://www.ecma-international.org/ecma-262/5.1/#sec-15.8.2.13
 * @param {Number} base The base component
 * @param {Number} exponent The exponential component
 * @return {Number} The power of the base component by the exponent.
 */
Math.nonImaginaryPow = function (base, exponent) {
    var positiveOutput = (base >= 0 && exponent >= 0) || (base < 0 && exponent < 0);
    var absBase = Math.abs(base);
    var absExponent = Math.abs(exponent);
    var output = Math.pow(absBase, absExponent);
    return positiveOutput ? output : -output;
};