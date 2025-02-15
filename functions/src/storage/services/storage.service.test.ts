import { jest } from '@jest/globals'
import { Busboy } from 'busboy'
import {
    mockFirebaseAdmin,
    mockStorageBucket,
    mockStorageBucketFile,
    mockStorageDelete,
    mockStorageMakePublic,
    mockStorageSave,
    resetFirebaseMocks,
} from '../../shared/models/firebase.mock'
import { mockBusboyInstance, mockEventCallbacks } from '../models/busboy.mock'
import {
    uploadFieldsMock,
    uploadProcessMock,
    uploadedFileMock,
} from '../models/upload.mock'
import { StorageService } from './storage.service'

// Mock de firebase-admin
jest.mock('firebase-admin', () => mockFirebaseAdmin)

// Mock de busboy
jest.mock('busboy')

describe('StorageService', () => {
    let service: StorageService

    beforeEach(() => {
        // Reset des mocks
        resetFirebaseMocks()
        jest.clearAllMocks()

        // Configuration des valeurs par défaut des mocks
        mockStorageSave.mockResolvedValue(undefined)
        mockStorageMakePublic.mockResolvedValue(undefined)
        mockStorageDelete.mockResolvedValue(undefined)

        // Création du service
        service = new StorageService()
    })

    describe('processUpload', () => {
        it('should process file upload successfully', async () => {
            // Démarrer le processus d'upload
            const processPromise = service.processUpload(
                mockBusboyInstance as unknown as Busboy,
                uploadedFileMock.buffer
            )

            // Simuler les événements Busboy
            mockEventCallbacks.field('folderName', uploadFieldsMock.folderName)
            mockEventCallbacks.field('fileName', uploadFieldsMock.fileName)
            mockEventCallbacks.file(
                'file',
                {
                    on: (event: string, callback: (data?: Buffer) => void) => {
                        if (event === 'data') callback(uploadedFileMock.buffer)
                        if (event === 'end') callback()
                    },
                },
                {
                    filename: uploadedFileMock.filename,
                    mimeType: uploadedFileMock.mimeType,
                }
            )
            mockEventCallbacks.finish()

            const result = await processPromise
            expect(result).toEqual(uploadProcessMock)
        })

        it('should reject when required fields are missing', async () => {
            // Démarrer le processus d'upload
            const processPromise = service.processUpload(
                mockBusboyInstance as unknown as Busboy,
                uploadedFileMock.buffer
            )

            // Simuler uniquement l'événement finish
            mockEventCallbacks.finish()

            await expect(processPromise).rejects.toThrow(
                'Missing required fields'
            )
        })

        it('should reject when no file is uploaded', async () => {
            // Démarrer le processus d'upload
            const processPromise = service.processUpload(
                mockBusboyInstance as unknown as Busboy,
                uploadedFileMock.buffer
            )

            // Simuler les champs mais pas de fichier
            mockEventCallbacks.field('folderName', uploadFieldsMock.folderName)
            mockEventCallbacks.field('fileName', uploadFieldsMock.fileName)
            mockEventCallbacks.finish()

            await expect(processPromise).rejects.toThrow('No file uploaded')
        })
    })

    describe('uploadFile', () => {
        it('should upload file successfully', async () => {
            const url = await service.uploadFile(
                uploadedFileMock.buffer,
                uploadFieldsMock.folderName,
                uploadedFileMock.filename,
                uploadedFileMock.mimeType
            )

            expect(mockStorageBucketFile).toHaveBeenCalledWith(
                `${uploadFieldsMock.folderName}/${uploadedFileMock.filename}`
            )
            expect(mockStorageSave).toHaveBeenCalledWith(
                uploadedFileMock.buffer,
                {
                    metadata: { contentType: uploadedFileMock.mimeType },
                }
            )
            expect(mockStorageMakePublic).toHaveBeenCalled()
            expect(url).toBe(
                `https://storage.googleapis.com/${mockStorageBucket.name}/${uploadFieldsMock.folderName}/${uploadedFileMock.filename}`
            )
        })

        it('should throw error when file upload fails', async () => {
            mockStorageSave.mockRejectedValueOnce(new Error('Upload failed'))

            await expect(
                service.uploadFile(
                    uploadedFileMock.buffer,
                    uploadFieldsMock.folderName,
                    uploadedFileMock.filename,
                    uploadedFileMock.mimeType
                )
            ).rejects.toThrow('Upload failed')
        })
    })

    describe('extractFilePathFromUrl', () => {
        it('should extract file path from valid URL', () => {
            const url = `https://storage.googleapis.com/${mockStorageBucket.name}/${uploadFieldsMock.folderName}/${uploadedFileMock.filename}`

            const result = service.extractFilePathFromUrl(
                url,
                uploadFieldsMock.folderName
            )

            expect(result).toBe(
                `${uploadFieldsMock.folderName}/${uploadedFileMock.filename}`
            )
        })

        it('should throw error for invalid URL format', () => {
            const url = 'https://invalid-url.com'

            expect(() =>
                service.extractFilePathFromUrl(url, uploadFieldsMock.folderName)
            ).toThrow('Invalid URL format')
        })
    })

    describe('deleteFile', () => {
        it('should delete file successfully', async () => {
            const filePath = `${uploadFieldsMock.folderName}/${uploadedFileMock.filename}`

            await service.deleteFile(filePath)

            expect(mockStorageBucketFile).toHaveBeenCalledWith(filePath)
            expect(mockStorageDelete).toHaveBeenCalled()
        })

        it('should throw error when delete fails', async () => {
            mockStorageDelete.mockRejectedValueOnce(new Error('Delete failed'))

            await expect(
                service.deleteFile(
                    `${uploadFieldsMock.folderName}/${uploadedFileMock.filename}`
                )
            ).rejects.toThrow('Delete failed')
        })
    })
})
