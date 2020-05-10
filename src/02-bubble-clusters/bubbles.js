
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
    return Math.sqrt(1 - distance/radius)
  }
}

class Link{
  constructor(item1, item2){
    this.id = Symbol("Link")
    this.item1 = item1
    this.item2 = item2
    item1.setLink(this)
    item2.setLink(this)
  }
  contains(item){
    return (this.item1 == item) || (this.item2 == item)
  }
  destroy(){
    this.item1.removeLink(this)
    this.item2.removeLink(this)
    if (this.line) {
      this.line.remove()
      delete this.line
    }
  }
  getId(){
    return this.id
  }
  create(draw){
    this.draw = draw
    let c1 = this.item1.getCenter()
    let c2 = this.item2.getCenter()
    this.line = draw.line(c1.x, c1.y, c2.x, c2.y).stroke({ width: 4, color: '#77a'}).back()
    //line.stroke({ color: '#f06', width: 10, linecap: 'round' })
    return this
  }
  update(draw){
    if (!this.line && draw) {
      return this.create(draw)
    }
    let c1 = this.item1.getCenter()
    let c2 = this.item2.getCenter()
    this.line.plot(c1.x, c1.y, c2.x, c2.y)
    return this
  }
}

class Item {
  /**
   * @param {object} properties {x, y, width, height, cls} 
   */
  constructor(properties){
    this.id = Symbol("Item")
    this.prop = properties
    this.field = new Field(this, properties.radius || properties.width)
    this.links = {}
  }
  getId(){
    return this.id
  }
  setLink(link){
    this.links[link.getId()] = link
  }
  removeLink(link){
    delete this.links[link.getId()]
  }
  hasLink(otherItem){
    const linkIds = Object.getOwnPropertySymbols(this.links);
    for(let id in linkIds){
      let link = this.links[linkIds[id]]
      if (link.contains(otherItem)) return link
    }
    return false
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
    const borderRadius = Math.round(0.15*Math.min(prop.width,prop.height))
    rect.radius(borderRadius)
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
    self.rect.on('dragstart', e => {
      self.rect.front()
    })
    self.rect.on("dragmove", (e)=>{
      const linkIds = Object.getOwnPropertySymbols(self.links);
      for(let id in linkIds){
        let link = self.links[linkIds[id]]
        link.update(self.draw)
      }
    })
  }
  getCenter(){
    let x = this.rect.x() + this.rect.width()/2
    let y = this.rect.y() + this.rect.height()/2
    return {x,y}
  }
  clone(){
    return new Item({...this.prop})
  }
  distanceTo(other){
    let c1 = this.getCenter()
    let c2 = other.getCenter()
    return Math.sqrt(Math.pow(c1.x-c2.x, 2)+Math.pow(c1.y-c2.y, 2))
  }
}


class Collection {
  /**
   * 
   * @param {object} {delta, width, height} 
   */
  constructor(properties){
    this.prop = properties
    this.items = []
    this.initField()
    this.network = new Network(this.items, 10 * properties.delta)
  }
  gridXY(column, row){
    let delta = this.prop.delta
    return {
      x: column * delta,
      y: row * delta
    }
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
    for (let xc = 0; xc < field.length; xc++){
      for (let yr = 0; yr < field[xc].length; yr++){
        let position = this.gridXY(xc, yr)
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
    const delta = this.prop.delta
    const radius = delta / 2
    let field = this.field
    if (!this.marks) this.marks = []
    let marks = this.marks
    for (let xc = 0; xc < field.length; xc++){
      if (!marks[xc]) marks.push([])
      for (let yr = 0; yr < field[xc].length; yr++){
        let markRadius = Math.min(2, field[xc][yr]) * radius
        let {x, y} = this.gridXY(xc, yr)
        x -= markRadius
        y -= markRadius
        if (!marks[xc][yr]) {
          marks[xc].push(draw.circle(2*markRadius).move(x,y).attr({fill: '#933', opacity: 0.2}))
          marks[xc][yr].back()
        } else if (marks[xc][yr].rx()!=markRadius) {
          marks[xc][yr].radius(markRadius).move(x,y)
        } 
      }
    }
  }
  drawFieldsOnMove(draw){
    let self = this
    let items = this.items
    for (let i in items){
      items[i].rect.on("dragmove", (e)=>{
        self.network.reconnect()
        self.computeField()
        self.showField(draw)
      })
    }
  }
}

class Network {
  constructor(items, clusterThreshold){
    this.items = items
    this.clusterThreshold = clusterThreshold
  }
  reconnect(){
    const distance = this.clusterThreshold
    for (let i in this.items){
      let item1 = this.items[i]
      for (let j in this.items){
        if (j==i) continue
        let item2 = this.items[j]
        let d = item1.distanceTo(item2)
        let link = item1.hasLink(item2)
        if ((d>distance) && link){
          link.destroy()
        }
        if ((d<=distance) && !link){
          new Link(item1, item2)
        }
      }
    }
  }
}
