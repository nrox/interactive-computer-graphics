"use strict";


class ImageScrollingInterface {
    constructor(imageId, canvasId, dWidth){
        let c = document.getElementById(canvasId)
        this.ctx = c.getContext("2d")
        this.image = document.getElementById(imageId)
        this.dWidth = dWidth || 300
        this.dHeight = this.dWidth
        this.sx = 0
        this.sy = 0
        this.scale = 1
    }
    setState(sx, sy, scale){
        this.sx = sx
        this.sy = sy
        this.scale = scale
    }
    draw(){
        let sWidth = this.scale * this.dWidth
        let sHeight = sWidth
        let dx = 0
        let dy = 0
        this.ctx.drawImage(this.image, this.sx, this.sy, sWidth, sHeight, dx, dy, this.dWidth, this.dHeight)
    }
}

var imageScroll;

$(document).ready(function() {
    imageScroll = new ImageScrollingInterface("image","canvas", 300)
    imageScroll.draw()
});


