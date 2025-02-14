import { isNil, isPlainObject, mapValues, omitBy } from 'lodash'

/**
 * Nettoie récursivement un objet en :
 * - Supprimant les propriétés avec valeurs `null` ou `undefined`
 * - Supprimant les tableaux contenant uniquement des valeurs `null`/`undefined`
 * - Supprimant les objets vides après nettoyage
 * - Conservant les valeurs `false`, `0` et chaînes vides
 */
export function cleanData<T extends object>(data: T): T {
    const clean = <U>(obj: U): U => {
        if (Array.isArray(obj)) {
            const cleanedArray = obj.map(clean).filter(v => !isNil(v))
            return (cleanedArray.length > 0 ? cleanedArray : undefined) as U
        }

        if (isPlainObject(obj)) {
            const cleanedObj = omitBy(
                mapValues(omitBy(obj as object, isNil), clean),
                isNil
            )
            return (
                Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined
            ) as U
        }

        return obj
    }

    return omitBy(clean(data), isNil) as T
}
