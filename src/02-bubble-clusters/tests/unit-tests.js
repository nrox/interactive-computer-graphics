

describe("bubbles.js", () => {

    function createItems(draw){
        let item = new Item({x: 0, y: 0, width: 30, height: 30, cls: 'item'})
        let item1 = item.clone().create(draw).move(10, 20).setColor('#345')
        let item2 = item.clone().create(draw).move(30, 90).setColor('#891')
        return [item1, item2]
    }

    it("...", () => {
        expect(true).toBe(true)
    })

    it("Field", () => {
        const draw = SVG('#svg')
        const items = createItems(draw)
        const item = items[0]
        const radius = 25
        const field = new Field(item, radius)

        expect(field.valueAt(item.getCenter())).toBe(1)

        let atBorder = item.getCenter()
        atBorder.x += radius
        expect(field.valueAt(atBorder)).toBe(0)

        let atMidWay = item.getCenter()
        atMidWay.x += 0.5*radius
        expect(field.valueAt(atMidWay)).toBe(0.5)

        let farAway = item.getCenter()
        farAway.x += 1.5*radius
        expect(field.valueAt(farAway)).toBe(0)
    })

})
      
  
  