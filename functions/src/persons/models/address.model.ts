import { Country } from '../enums/country.enum'

export interface Address {
    streetNumber?: string
    streetName: string
    city: string
    postalCode: string
    country: Country
}
