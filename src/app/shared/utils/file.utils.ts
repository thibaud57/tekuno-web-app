import { getIsoDate } from './date.utils'

export const getAvatarFileName = (fileName: string): string => {
    const name = getFileNameWithoutExtension(fileName)
    return `avatars/${name}_${getIsoDate()}`
}

const getFileNameWithoutExtension = (fileName: string): string => {
    return fileName.split('.').slice(0, -1).join('.')
}
