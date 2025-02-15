import { Pipe, PipeTransform, inject } from '@angular/core'
import { TranslationService } from '../../core/translation/translation.service'

@Pipe({
    name: 'sortAlphabetically',
    standalone: true,
})
export class SortAlphabeticallyPipe implements PipeTransform {
    private readonly translationService = inject(TranslationService)

    transform(values: string[], translationPrefix?: string): string[] {
        if (!values) return []

        return [...values].sort((a, b) => {
            const aText = translationPrefix
                ? this.translationService.getTranslation(translationPrefix + a)
                : a
            const bText = translationPrefix
                ? this.translationService.getTranslation(translationPrefix + b)
                : b
            return aText.localeCompare(bText, undefined, {
                sensitivity: 'base',
            })
        })
    }
}
