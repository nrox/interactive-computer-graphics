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
        this.ctx.clearRect(dx,dy, this.dWidth, this.dHeight)
        this.ctx.drawImage(this.image, this.sx, this.sy, sWidth, sHeight, dx, dy, this.dWidth, this.dHeight)
    }
    simpleScrolling(){
        let sx = this.sx0 - this.xm + this.x0
        let sy = this.sy0 - this.ym + this.y0
        let scale = this.scale
        this.setState(sx, sy, scale)
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
            self.sx0 = self.sx
            self.sy0 = self.sy
            self.scale0 = self.scale
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
            self.xm = x
            self.ym = y
            console.log("dx: " + self.dx, "dy: " + self.dy); 
            self.simpleScrolling()
            self.draw()
        } 
    }
}

var imageScroll;

$(document).ready(function() {
    imageScroll = new ImageScrollingInterface("image","canvas", 300)
    imageScroll.draw()
});


