/**
 * Nettoie récursivement un objet en :
 * - Transformant null en undefined
 * - Supprimant les propriétés undefined
 * - Nettoyant les tableaux vides
 * - Nettoyant les objets imbriqués
 */
export function cleanData<T>(
    data: T
): T extends object ? Partial<T> : undefined {
    if (!data || typeof data !== 'object') {
        return undefined as T extends object ? Partial<T> : undefined
    }

    const result = {} as Partial<T>

    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
        // Ignorer les valeurs null ou undefined
        if (value === null || value === undefined) {
            return
        }

        // Nettoyer les tableaux
        if (Array.isArray(value)) {
            const cleanedArray = value.filter(
                item => item !== null && item !== undefined
            )
            if (cleanedArray.length > 0) {
                result[key as keyof T] = cleanedArray as T[keyof T]
            }
            return
        }

        // Nettoyer les objets imbriqués
        if (typeof value === 'object') {
            const cleanedObj = cleanData(value)
            if (cleanedObj && Object.keys(cleanedObj).length > 0) {
                result[key as keyof T] = cleanedObj as T[keyof T]
            }
            return
        }

        // Garder les valeurs primitives non nulles
        result[key as keyof T] = value as T[keyof T]
    })

    return result as T extends object ? Partial<T> : undefined
}
