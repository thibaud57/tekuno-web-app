import { z } from 'zod'

export const bankDetailsSchema = z
    .object({
        name: z.string().min(1, 'Bank account name is required'),
        iban: z.string().nullish(),
        bic: z.string().nullish(),
        paypal: z.string().email('Invalid PayPal email address').nullish(),
    })
    .nullish()
