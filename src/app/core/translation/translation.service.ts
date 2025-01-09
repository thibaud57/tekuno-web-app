import { Injectable } from '@angular/core'
import { TranslocoService } from '@ngneat/transloco'

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    constructor(private translocoService: TranslocoService) {}

    getTranslation(key: string, params?: object): string {
        return this.translocoService.translate(key, params)
    }
}
