import { Injectable, inject } from '@angular/core'
import { TranslocoService } from '@ngneat/transloco'

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    private readonly translocoService = inject(TranslocoService)

    getTranslation(key: string, params?: object): string {
        return this.translocoService.translate(key, params)
    }
}
