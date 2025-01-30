import { Pipe, PipeTransform } from '@angular/core'

interface GroupedItem<T> {
    letter: string
    items: T[]
}

@Pipe({
    name: 'groupByLetter',
    standalone: true,
})
export class GroupByLetterPipe implements PipeTransform {
    transform<T extends { name: string }>(
        items: T[],
        property: keyof T = 'name'
    ): GroupedItem<T>[] {
        if (!items?.length) {
            return []
        }

        const groups = items.reduce((groups: Record<string, T[]>, item) => {
            const letter = item[property].toString().charAt(0).toUpperCase()
            if (!groups[letter]) {
                groups[letter] = []
            }
            groups[letter].push(item)
            return groups
        }, {})

        return Object.keys(groups)
            .sort()
            .map(letter => ({
                letter,
                items: groups[letter].sort((a, b) =>
                    a[property].toString().localeCompare(b[property].toString())
                ),
            }))
    }
}
