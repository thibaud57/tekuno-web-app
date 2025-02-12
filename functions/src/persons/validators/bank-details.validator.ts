import { z } from 'zod'

export const bankDetailsSchema = z
    .object({
        name: z.string().nullish(),
        iban: z.string().nullish(),
        bic: z.string().nullish(),
        paypal: z.string().email('Invalid PayPal email address').nullish(),
    })
    .refine(
        data => {
            // Si au moins un champ est rempli (autre que name), alors name est obligatoire et doit faire au moins 2 caractères
            const hasValue = data.iban || data.bic || data.paypal
            if (!hasValue) {
                return true // Si aucun champ n'est rempli, c'est valide
            }
            return data.name.length >= 2 // Sinon name doit faire au moins 2 caractères
        },
        {
            message:
                'Bank account name is required when providing bank details',
        }
    )
    .nullish()
