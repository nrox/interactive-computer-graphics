
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

class Item {
  /**
   * @param {object} properties {x, y, width, height, cls} 
   */
  constructor(properties){
    this.prop = properties
    this.field = new Field(this, properties.radius || properties.width)
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


class Group {
  /**
   * 
   * @param {object} {delta, width, height} 
   */
  constructor(properties){
    this.prop = properties
    this.items = []
    this.initField()
  }
  initField(){
    const delta = this.prop.delta
    const rows = Math.ceil(this.prop.height / delta)
    const cols = Math.ceil(this.prop.width / delta)
    let field = []
    for (let xc = 0; xc < cols; xc++){
      let row = []
      for (let yr = 0; yr < rows; yr++){
        row.push(0)
      }
      field.push(row)
    }
    this.field = field
    this.rows = rows
    this.cols = cols
  }
  resetField(){
    let field = this.field
    for (let xc = 0; xc < field.length; xc++){
      for (let yr = 0; yr < field[xc].length; yr++){
        field[xc][yr] = 0
      }
    }
  }
  increaseField(xc, yr, value){
    this.field[xc][yr] += value
  }
  computeField(){
    this.resetField()
    let field = this.field
    const delta = this.prop.delta 
    for (let xc = 0; xc < field.length; xc++){
      for (let yr = 0; yr < field[xc].length; yr++){
        let position = {
          x: xc * delta,
          y: yr * delta
        }
        for (let i in this.items){
          let item = this.items[i]
          let value = item.field.valueAt(position)
          this.increaseField(xc, yr, value)
        }      
      }
    }
    return this.field
  }
  add(item){
    this.items.push(item)
  }
  addItems(items){
    for (let i in items) this.add(items[i])
  }
  showField(draw){

  }
}
