export const cleanPhoneNumber = (
    phone: number | null,
    countryCode: string
): string | null => {
    if (!phone) {
        return null
    }

    const cleaned = phone.toString().replace(/\D/g, '').trim()

    return cleaned.startsWith('0')
        ? countryCode + cleaned.substring(1)
        : countryCode + cleaned
}
