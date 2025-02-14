import { Busboy } from 'busboy'
import { storage } from 'firebase-admin'
import {
    UploadedFile,
    UploadFields,
    UploadProcess,
} from '../models/upload.model'

export class StorageService {
    private readonly bucket = storage().bucket()
    private readonly STORAGE_URL = 'https://storage.googleapis.com'

    async processUpload(
        busboy: Busboy,
        rawBody: Buffer
    ): Promise<UploadProcess> {
        return new Promise((resolve, reject) => {
            const fields: Partial<UploadFields> = {}
            let fileData: UploadedFile | null = null

            busboy.on('field', (fieldname: string, value: string) => {
                if (fieldname === 'folderName' || fieldname === 'fileName') {
                    fields[fieldname] = value
                }
            })

            busboy.on('file', (_fieldname, file, info) => {
                const chunks: Buffer[] = []
                file.on('data', chunk => chunks.push(chunk))
                file.on('end', () => {
                    fileData = {
                        buffer: Buffer.concat(chunks),
                        filename: fields.fileName || info.filename,
                        mimeType: info.mimeType,
                    }
                })
            })

            busboy.on('finish', () => {
                if (!fields.folderName || !fields.fileName) {
                    reject(new Error('Missing required fields'))
                    return
                }
                if (!fileData) {
                    reject(new Error('No file uploaded'))
                    return
                }
                resolve({
                    fields: fields as UploadFields,
                    file: fileData,
                })
            })

            busboy.on('error', reject)
            busboy.end(rawBody)
        })
    }

    async uploadFile(
        file: Buffer,
        path: string,
        filename: string,
        mimetype: string
    ): Promise<string> {
        const fullPath = `${path}/${filename}`
        const fileUpload = this.bucket.file(fullPath)

        await fileUpload.save(file, {
            metadata: {
                contentType: mimetype,
            },
        })

        await fileUpload.makePublic()

        return `${this.STORAGE_URL}/${this.bucket.name}/${fullPath}`
    }

    extractFilePathFromUrl(url: string, folderName: string): string {
        const matches = url.match(new RegExp(`\\/${folderName}\\/([^?]+)`))

        if (!matches || matches.length < 2) {
            throw new Error('Invalid URL format')
        }

        const fileName = matches[1].split('/').pop() || matches[1]
        return `${folderName}/${fileName}`
    }

    async deleteFile(filePath: string) {
        await this.bucket.file(filePath).delete()
    }
}
