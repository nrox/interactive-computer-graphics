
class Item {
  /**
   * @param {object} properties {x, y, width, height, cls} 
   */
  constructor(properties){
    this.prop = properties
  }
  setProp(name, value){
    this.prop[name] = value
  }
  getProp(name){
    return this.prop[name]
  }
  create(draw){
    this.draw = draw
    let prop = this.prop
    let rect = draw.rect(prop.width, prop.height)
    rect.addClass(prop.cls)
    rect.move(prop.x || 0, prop.y || 0)
    rect.draggable()
    this.rect = rect
    this.addEvents()
    return this
  }
  setColor(color){
    this.rect.fill(color)
    return this
  }
  move(x, y){
    this.rect.move(x, y)
    return this
  }
  addEvents(){
    const self = this
    this.rect.draggable().on('dragmove', e => {

    })
  }
  getCenter(){
    let x = (2*this.rect.x() + this.rect.width())/2
    let y = (2*this.rect.y() + this.rect.height())/2
    return {x,y}
  }
  clone(){
    return new Item({...this.prop})
  }
}

class Field {
  constructor(item, radius){
    this.item = item
    this.radius = radius
  }
  valueAt({x, y}){
    let center = this.item.getCenter()
    let radius = this.radius
    let distance = Math.sqrt(Math.pow(center.x - x, 2) + Math.pow(center.y - y, 2)) 
    if (distance>=radius) return 0
    return 1 - distance/radius
  }
}
