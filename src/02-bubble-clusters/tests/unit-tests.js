

describe("bubbles.js", () => {

    let DRAW
    let ITEMS

    beforeAll(()=>{
        DRAW = SVG('#svg')
        ITEMS = createItems(DRAW)
    })

    function createItems(draw){
        let item = new Item({x: 0, y: 0, width: 32, height: 32, cls: 'item', radius: 64})
        let item1 = item.clone().create(draw).move(16, 16).setColor('#345')
        let item2 = item.clone().create(draw).move(48, 48).setColor('#891')
        return [item1, item2]
    }

    function testField(field, testFunction){
        return field.map(row=>row.map(testFunction).reduce((a,b)=>a&&b)).reduce((a,b)=>a&&b)
    }

    function drawFieldsOnMove(group){
        for (let i in ITEMS){
            ITEMS[i].rect.on("dragmove", (e)=>{
                group.computeField()
                group.showField(DRAW)
            })
        }
    }

    it("...", () => {
        expect(true).toBe(true)
    })

    it("Field", () => {
        
        const item = ITEMS[0]
        const radius = 25
        const field = new Field(item, radius)

        expect(field.valueAt(item.getCenter())).toBe(1)

        let atBorder = item.getCenter()
        atBorder.x += radius
        expect(field.valueAt(atBorder)).toBe(0)

        let atMidWay = item.getCenter()
        atMidWay.x += 0.5*radius
        expect(field.valueAt(atMidWay)).toBe(Math.sqrt(0.5))

        let farAway = item.getCenter()
        farAway.x += 1.5*radius
        expect(field.valueAt(farAway)).toBe(0)

        console.log(item)
    })

    it("Group", () => {
        const prop = {delta: 16, width: 420, height: 420}
        const group = new Group(prop)
        group.addItems(ITEMS)
        expect(group.items.length).toBe(ITEMS.length)

        let all0 = testField(group.field, value => value == 0)
        let numeric = testField(group.field, value => !isNaN(value))
        expect(numeric).toBe(true)
        expect(all0).toBe(true)
        
        group.computeField()
        all0 = testField(group.field, value => value == 0)
        numeric = testField(group.field, value => !isNaN(value))
        expect(numeric).toBe(true)
        expect(all0).toBe(false)
        group.showField(DRAW)

        group.resetField()
        all0 = testField(group.field, value => value == 0)
        numeric = testField(group.field, value => !isNaN(value))
        expect(numeric).toBe(true)
        expect(all0).toBe(true)

        drawFieldsOnMove(group)
    })

})
      
  
  