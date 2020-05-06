

function createItems(draw){
  let item = new Item({x: 100, y: 30, width: 100, height: 100, cls: 'item'})
  let item1 = item.clone().create(draw).move(50, 90).setColor('#345')
  let item2 = item.clone().create(draw).move(155, 190).setColor('#891')
  let item3 = item.clone().create(draw).move(210, 50).setColor('#941')
  let item4 = item.clone().create(draw).move(310, 150).setColor('#396')
}

window.addEventListener('load', (event) => {
  let draw = SVG('#svg')
  createItems(draw)
});
