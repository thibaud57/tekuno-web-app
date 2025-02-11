import { z } from 'zod'
import { Country } from '../enums/country.enum'

export const addressSchema = z
    .object({
        streetNumber: z.string().nullish(),
        streetName: z.string().min(1, 'Street name is required'),
        city: z.string().min(1, 'City is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        country: z.nativeEnum(Country, {
            required_error: 'Country is required',
        }),
    })
    .nullish()
