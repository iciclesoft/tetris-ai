var GridBlock = function (x, y, w, h) {
    if (x instanceof GridBlock) {
        this.x = x.x;
        this.y = x.y;
        this.w = x.w;
        this.h = x.h;
        this.strokeColor = x.strokeColor.copy();
        this.block = x.block;
    } else {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.strokeColor = new Color(64);
        this.block;
    }
};

GridBlock.prototype.show = function () {
    ctx.showStroke = true;
    ctx.lineWidth = 2;
    ctx.strokeColor(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b);
    ctx.showFill = false;
    // Shows 'irrelevant' rows
    if ((this.y / this.h) > new PatternFinder().firstRelevantRow()) {
        ctx.showFill = true;
        ctx.fillColor(164, 64, 64, 1);
    }
    ctx.rect(this.x, this.y, this.w, this.h);

    if (this.block) {
        ctx.showStroke = false;
        ctx.showFill = true;
        ctx.block3D(this.x, this.y, this.w, this.h, this.block.fillColor);
        //var offset = 0;
        //var twoOffset = offset * 2;
        //ctx.block3D(this.x + offset, this.y + offset, this.w - twoOffset, this.h - twoOffset, this.block.fillColor);
    }
};