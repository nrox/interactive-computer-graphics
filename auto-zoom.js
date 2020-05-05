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
        this.registerEvents(c)
    }
    registerEvents(canvas){
        const self = this
        canvas.addEventListener("mousedown", mouseDown); 
        canvas.addEventListener("mouseup", mouseUp); 
        canvas.addEventListener("mousemove", mouseMove); 

        function mouseDown(event) { 
            self.pressed = true
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top; 
            self.x0 = x
            self.y0 = y
            self.time0 = new Date().getTime()
            console.log("Coordinate x: " + x, "Coordinate y: " + y); 
        } 
        function mouseUp(event) { 
            self.pressed = false
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top; 
            self.x1 = x
            self.y1 = y
            self.time1 = new Date().getTime()
            console.log("Coordinate x: " + x, "Coordinate y: " + y); 
        } 
        function mouseMove(event) { 
            if (!self.pressed) return
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top; 
            let t = new Date().getTime()
            self.dt = t - (self.lastT===undefined? (t+1) : self.lastT)
            self.dx = (x - (self.lastX===undefined? x : self.lastX)) / self.dt
            self.dy = (y - (self.lastY===undefined? y : self.lastY)) / self.dt
            self.lastX = x
            self.lastY = y
            self.lastT = t
            console.log("dx: " + self.dx, "dy: " + self.dy); 
        } 
    }
    setState(sx, sy, scale){
        this.sx = sx
        this.sy = sy
        this.scale = scale
    }
    draw(){
        let sWidth = Math.round(this.scale * this.dWidth)
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


