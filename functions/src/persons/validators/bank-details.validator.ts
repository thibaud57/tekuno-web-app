import { z } from 'zod'

export const bankDetailsSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Bank account name must be at least 2 characters'),
        iban: z.string().nullish(),
        bic: z.string().nullish(),
        paypal: z.string().email('Invalid PayPal email address').nullish(),
    })
    .nullish()
