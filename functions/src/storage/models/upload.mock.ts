import { UploadFields, UploadProcess, UploadedFile } from './upload.model'

export const uploadedFileMock: UploadedFile = {
    buffer: Buffer.from('test file content'),
    filename: 'test-image.jpg',
    mimeType: 'image/jpeg',
}

export const uploadFieldsMock: UploadFields = {
    folderName: 'avatars',
    fileName: 'test-image.jpg',
}

export const uploadProcessMock: UploadProcess = {
    file: uploadedFileMock,
    fields: uploadFieldsMock,
}

export const uploadedPdfFileMock: UploadedFile = {
    buffer: Buffer.from('test pdf content'),
    filename: 'document.pdf',
    mimeType: 'application/pdf',
}

export const uploadFieldsCustomFolderMock: UploadFields = {
    folderName: 'documents/contracts',
    fileName: 'contract.pdf',
}

export const uploadProcessPdfMock: UploadProcess = {
    file: uploadedPdfFileMock,
    fields: uploadFieldsCustomFolderMock,
}
