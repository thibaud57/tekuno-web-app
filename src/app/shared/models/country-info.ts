import { Country } from '@backend/persons/enums/country.enum'

export interface CountryInfo {
    name: Country
    isoCode: string
    phonePrefix?: string
}

export const CountriesInfo: CountryInfo[] = [
    { name: Country.FRANCE, isoCode: 'FR', phonePrefix: '+33' },
    { name: Country.GERMANY, isoCode: 'DE', phonePrefix: '+49' },
    { name: Country.LUXEMBOURG, isoCode: 'LU', phonePrefix: '+352' },
    { name: Country.NETHERLANDS, isoCode: 'NL', phonePrefix: '+31' },
    { name: Country.UK, isoCode: 'GB', phonePrefix: '+44' },
    { name: Country.ITALY, isoCode: 'IT', phonePrefix: '+39' },
    { name: Country.PORTUGAL, isoCode: 'PT', phonePrefix: '+351' },
    { name: Country.SPAIN, isoCode: 'ES', phonePrefix: '+34' },
    { name: Country.SWITZERLAND, isoCode: 'CH', phonePrefix: '+41' },
]
