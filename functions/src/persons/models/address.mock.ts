import { Country } from '../enums/country.enum'
import { Address } from './address.model'

export const addressMock: Address = {
    streetNumber: '42',
    streetName: 'Rue Lothaire',
    city: 'Metz',
    postalCode: '57000',
    country: Country.FRANCE,
}
