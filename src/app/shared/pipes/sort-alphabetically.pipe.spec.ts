import { TestBed } from '@angular/core/testing'
import { TranslationServiceMock } from 'app/core/translation/translation.service.mock'
import { TranslationService } from '../../core/translation/translation.service'
import { SortAlphabeticallyPipe } from './sort-alphabetically.pipe'

describe('SortAlphabeticallyPipe', () => {
    let pipe: SortAlphabeticallyPipe
    let translationService: TranslationService

    beforeEach(() => {
        translationService = jasmine.createSpyObj('TranslationService', [
            'getTranslation',
        ])

        TestBed.configureTestingModule({
            providers: [
                SortAlphabeticallyPipe,
                {
                    provide: TranslationService,
                    useValue: TranslationServiceMock,
                },
            ],
        })

        pipe = TestBed.inject(SortAlphabeticallyPipe)
        translationService = TestBed.inject(TranslationService)
    })

    it('should sort strings alphabetically without translation', () => {
        const values = ['Zebra', 'alpha', 'Beta']
        const result = pipe.transform(values)
        expect(result).toEqual(['alpha', 'Beta', 'Zebra'])
    })

    it('should handle empty array', () => {
        const result = pipe.transform([])
        expect(result).toEqual([])
    })

    it('should handle null value', () => {
        const result = pipe.transform(null as any)
        expect(result).toEqual([])
    })

    it('should sort with translations', () => {
        const values = ['ADMIN', 'USER', 'GUEST']
        translationService.getTranslation.and.callFake((key: string) => {
            const translations: Record<string, string> = {
                'enums.role-type.ADMIN': 'Administrateur',
                'enums.role-type.USER': 'Utilisateur',
                'enums.role-type.GUEST': 'Invité',
            }
            return translations[key] || key
        })

        const result = pipe.transform(values, 'enums.role-type.')
        expect(result).toEqual(['ADMIN', 'GUEST', 'USER'])

        expect(translationService.getTranslation).toHaveBeenCalledWith(
            'enums.role-type.ADMIN'
        )
        expect(translationService.getTranslation).toHaveBeenCalledWith(
            'enums.role-type.USER'
        )
        expect(translationService.getTranslation).toHaveBeenCalledWith(
            'enums.role-type.GUEST'
        )
    })

    it('should not modify original array', () => {
        const values = ['C', 'B', 'A']
        const original = [...values]
        pipe.transform(values)
        expect(values).toEqual(original)
    })
})
