export const formatPhoneNumber = (
    phone: string,
    countryCode: string
): string => {
    // On ne garde que les chiffres
    let cleaned = phone.replace(/\D/g, '')

    // Si le numéro commence par 0, on l'enlève
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1)
    }

    // On formate par groupe de 2 chiffres
    const match = cleaned.match(
        /^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/
    )
    if (match) {
        const parts = match.slice(1).filter(part => part)
        return parts.join(' ')
    }

    return cleaned
}

export const cleanPhoneNumber = (
    phone: string,
    countryCode: string
): string => {
    // On ne garde que les chiffres
    let cleaned = phone.replace(/\D/g, '')

    // Si le numéro commence par 0, on l'enlève
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1)
    }

    // On retourne le numéro avec l'indicatif
    return countryCode + cleaned
}
