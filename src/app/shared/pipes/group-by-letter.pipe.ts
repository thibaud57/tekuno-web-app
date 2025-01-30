import { Pipe, PipeTransform } from '@angular/core'
import { GroupedItem } from '../models/grouped-item.model'

@Pipe({
    name: 'groupByLetter',
    standalone: true,
})
export class GroupByLetterPipe implements PipeTransform {
    transform<T extends Record<K, string>, K extends keyof T>(
        items: T[],
        property: K
    ): GroupedItem<T>[] {
        if (!items?.length) {
            return []
        }

        const groups = items.reduce((groups: Record<string, T[]>, item) => {
            const value = item[property] || '#'
            const letter = value.charAt(0).toUpperCase()
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
                items: groups[letter].sort((a, b) => {
                    const valueA = a[property] || ''
                    const valueB = b[property] || ''
                    return valueA.localeCompare(valueB)
                }),
            }))
    }
}
