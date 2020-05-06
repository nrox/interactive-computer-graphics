
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
    rect.fill('orange')
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
      const { handler, box } = e.detail
      let x = box.x
      let y = box.y
      console.log(`${x},${y}`)
      console.log(self.getCenter())
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

function createItems(draw){
  let item1 = new Item({x: 100, y: 30, width: 100, height: 100, cls: 'item'})
  let item2 = item1.clone()
  item1.create(draw)
  item2.create(draw)
  item1.move(50, 90).setColor('#954')
  item2.move(150, 290).setColor('#297')


}

window.addEventListener('load', (event) => {
  let draw = SVG('#svg')
  createItems(draw)
});
