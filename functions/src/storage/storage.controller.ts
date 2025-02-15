import * as Busboy from 'busboy'
import { Request, Response } from 'express'
import { ApiError } from '../shared/models/api-error.model'
import { handleBadRequestError, handleError } from '../shared/utils/error.utils'
import { RequestWithRawBody } from './middlewares/upload.middleware'
import { StorageService } from './services/storage.service'

export async function uploadFile(req: RequestWithRawBody, res: Response) {
    try {
        const busboy = Busboy({ headers: req.headers })
        const storageService = new StorageService()

        const { fields, file } = await storageService.processUpload(
            busboy,
            req.rawBody as Buffer
        )

        if (
            !file?.buffer ||
            !fields?.folderName ||
            !file?.filename ||
            !file?.mimeType
        ) {
            const error: ApiError = new Error('Missing required upload data')
            return handleBadRequestError(res, error)
        }

        const url = await storageService.uploadFile(
            file.buffer,
            fields.folderName,
            file.filename,
            file.mimeType
        )

        return res.status(201).json({ url })
    } catch (error) {
        return handleError(res, error as Error)
    }
}

export async function deleteFile(req: Request, res: Response) {
    try {
        const { url, folderName } = req.body
        const storageService = new StorageService()

        if (!url) {
            const error: ApiError = new Error('Missing required url')
            return handleBadRequestError(res, error)
        }

        const filePath = storageService.extractFilePathFromUrl(url, folderName)

        await storageService.deleteFile(filePath)

        return res.status(204).send()
    } catch (error) {
        return handleError(res, error as Error)
    }
}
