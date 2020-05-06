

describe("bubbles.js", () => {

    function createItems(draw){
        let item = new Item({x: 0, y: 0, width: 30, height: 30, cls: 'item'})
        let item1 = item.clone().create(draw).move(50, 90).setColor('#345')
        let item2 = item.clone().create(draw).move(155, 190).setColor('#891')
        return [item1, item2]
    }

    it("...", () => {
        expect(true).toBe(true)
    })

    it("Field", () => {
        let draw = SVG('#svg')
        let items = createItems(draw)
        expect(true).toBe(true)
    })

})
      
  
  