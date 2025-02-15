import { Busboy } from 'busboy'
import { UploadFields, UploadedFile } from './upload.model'

type BusboyFieldCallback = (fieldname: string, value: string) => void
type BusboyFileCallback = (
    fieldname: string,
    file: {
        on: (event: string, callback: (data?: Buffer) => void) => void
    },
    info: { filename: string; mimeType: string }
) => void
type BusboyFinishCallback = () => void

// Un simple objet pour stocker les callbacks
export const mockEventCallbacks: Record<string, any> = {}

// Instance mock de Busboy avec juste ce dont on a besoin
export const mockBusboyInstance = {
    on: jest.fn((event: string, callback: any) => {
        mockEventCallbacks[event] = callback
    }),
    emit: jest.fn(),
    end: jest.fn(),
}

// Mock du module busboy
jest.mock('busboy', () => ({
    Busboy: jest.fn(() => mockBusboyInstance),
}))

export const createMockBusboy = (fields: UploadFields, file?: UploadedFile) =>
    ({
        on: jest.fn().mockImplementation((...args: unknown[]) => {
            const [event, callback] = args as [
                string,
                BusboyFieldCallback | BusboyFileCallback | BusboyFinishCallback,
            ]

            if (event === 'field') {
                const fieldCallback = callback as BusboyFieldCallback
                Object.entries(fields).forEach(([key, value]) => {
                    fieldCallback(key, value)
                })
            }

            if (event === 'file' && file) {
                const fileCallback = callback as BusboyFileCallback
                fileCallback(
                    'file',
                    {
                        on: (
                            event: string,
                            callback: (data?: Buffer) => void
                        ) => {
                            if (event === 'data') callback(file.buffer)
                            if (event === 'end') callback()
                        },
                    },
                    {
                        filename: file.filename,
                        mimeType: file.mimeType,
                    }
                )
            }

            if (event === 'finish') {
                const finishCallback = callback as BusboyFinishCallback
                finishCallback()
            }
        }),
        emit: jest.fn(),
        end: jest.fn(),
    }) as unknown as Busboy
