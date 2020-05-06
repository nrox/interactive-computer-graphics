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
    zoomScrolling(){
        let sx = this.sx0 - this.xm + this.x0
        let sy = this.sy0 - this.ym + this.y0
        let v = this.getSpeed()
        let scale = this.scale0 * (10*v + 1)
        this.setState(sx, sy, scale)
    }
    scrolling(){
        //this.simpleScrolling();
        this.zoomScrolling();
    }
    getSpeed(){
        if (!this.pressed) return 0
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    }
    updateVelocity(x, y, t){
        const alpha = 300
        const self = this
        const lastVx = self.vx || 0 
        const lastVy = self.vy || 0 
        const lastT = self.lastT || (t-1) 
        const lastX = self.lastX || x
        const lastY = self.lastY || y
        const dt = t - lastT
        const weight = Math.min(dt / alpha, 1)
        let vx = (x - lastX) / dt
        let vy = (y - lastY) / dt
        vx = vx * weight + lastVx * (1-weight)
        vy = vy * weight + lastVy * (1-weight)
        self.lastX = x
        self.lastY = y
        self.lastT = t
        self.xm = x
        self.ym = y
        self.vx = vx
        self.vy = vy
        //console.log("vx: " + self.vx, "vy: " + self.vy); 
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
            self.scale0 = 1
            self.time0 = new Date().getTime()
            //console.log("Coordinate x: " + x, "Coordinate y: " + y); 
        } 
        function mouseUp(event) { 
            self.pressed = false
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top; 
            self.x1 = x
            self.y1 = y
            self.scale0 = 1
            self.time1 = new Date().getTime()
            self.scrolling()
            self.draw()
            //console.log("Coordinate x: " + x, "Coordinate y: " + y); 
        } 
        function mouseMove(event) { 
            if (!self.pressed) return
            let rect = canvas.getBoundingClientRect(); 
            let x = event.clientX - rect.left; 
            let y = event.clientY - rect.top; 
            let t = new Date().getTime()
            self.updateVelocity(x,y,t)
            self.scrolling()
            self.draw()
        } 
    }
}

var imageScroll;

$(document).ready(function() {
    imageScroll = new ImageScrollingInterface("image","canvas", 300)
    imageScroll.draw()
});


