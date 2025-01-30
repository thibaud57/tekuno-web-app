import { BankDetails } from './bank-details.model'

export const bankDetailsIbanMock: BankDetails = {
    name: 'Compte Pro France',
    iban: 'FR7630006000011234567890189',
    bic: 'BNPAFRPP',
}

export const bankDetailsPaypalMock: BankDetails = {
    name: 'PayPal Business',
    paypal: 'business@mail.com',
}
