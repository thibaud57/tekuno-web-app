import { GroupByLetterPipe } from './group-by-letter.pipe'

describe('GroupByLetterPipe', () => {
    let pipe: GroupByLetterPipe

    interface TestItem {
        name: string
    }

    const testItems: TestItem[] = [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Anna' },
        { name: 'Charlie' },
        { name: 'Bernard' },
    ]

    beforeEach(() => {
        pipe = new GroupByLetterPipe()
    })

    it('should return empty array for null or empty input', () => {
        const nullArray: TestItem[] = null
        expect(pipe.transform<TestItem, 'name'>(nullArray, 'name')).toEqual([])
        expect(pipe.transform<TestItem, 'name'>([], 'name')).toEqual([])
    })

    it('should group items by first letter', () => {
        const result = pipe.transform(testItems, 'name')

        expect(result.length).toBe(3)
        expect(result[0].letter).toBe('A')
        expect(result[0].items.length).toBe(2)
        expect(result[1].letter).toBe('B')
        expect(result[1].items.length).toBe(2)
        expect(result[2].letter).toBe('C')
        expect(result[2].items.length).toBe(1)
    })

    it('should sort items within groups alphabetically', () => {
        const result = pipe.transform(testItems, 'name')

        const aGroup = result.find(group => group.letter === 'A')
        expect(aGroup.items[0].name).toBe('Alice')
        expect(aGroup.items[1].name).toBe('Anna')

        const bGroup = result.find(group => group.letter === 'B')
        expect(bGroup.items[0].name).toBe('Bernard')
        expect(bGroup.items[1].name).toBe('Bob')
    })

    it('should handle custom property', () => {
        interface CustomItem {
            title: string
        }

        const customItems: CustomItem[] = [
            { title: 'Zebra' },
            { title: 'Ant' },
            { title: 'Zoo' },
        ]

        const result = pipe.transform(customItems, 'title')

        expect(result.length).toBe(2)
        expect(result[0].letter).toBe('A')
        expect(result[1].letter).toBe('Z')
        expect(result[1].items.length).toBe(2)
    })

    it('should handle empty strings and null values', () => {
        interface ItemWithOptionalName {
            name: string | null
        }

        const itemsWithNulls: ItemWithOptionalName[] = [
            { name: 'Alice' },
            { name: null },
            { name: 'Bob' },
            { name: '' },
            { name: 'Charlie' },
        ]

        const result = pipe.transform<ItemWithOptionalName, 'name'>(
            itemsWithNulls,
            'name'
        )

        expect(result.length).toBe(4)
        expect(result[0].letter).toBe('#')
        expect(result[0].items.length).toBe(2)
        expect(result[1].letter).toBe('A')
        expect(result[2].letter).toBe('B')
        expect(result[3].letter).toBe('C')
    })
})
