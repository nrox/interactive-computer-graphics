

function createItems(draw){
  let item = new Item({x: 100, y: 30, width: 64, height: 64, cls: 'item', radius: 96})
  let item1 = item.clone().create(draw).move(50, 90).setColor('#345')
  let item2 = item.clone().create(draw).move(155, 190).setColor('#891')
  let item3 = item.clone().create(draw).move(210, 50).setColor('#941')
  let item4 = item.clone().create(draw).move(310, 150).setColor('#396')
  const prop = {delta: 16, width: 550, height: 550}
  const collection = new Collection(prop)
  collection.addItems([item1, item2, item3, item4])
  collection.computeField()
  collection.showField(draw)
  collection.drawFieldsOnMove(draw)
}

window.addEventListener('load', (event) => {
  let draw = SVG('#svg')
  createItems(draw)
});
