import { Country } from '@backend/persons/enums/country.enum'
import { CountriesInfo, CountryInfo } from '../models/country-info'

export const getFlag = (isoCode: string): string =>
    `/images/flags/${isoCode}.svg`

export const getDefaultCountry = (): CountryInfo =>
    CountriesInfo.find(country => country.name === Country.FRANCE)
