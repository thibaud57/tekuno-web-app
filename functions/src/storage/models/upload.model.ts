export interface UploadProcess {
    file: UploadedFile
    fields: UploadFields
}

export interface UploadFields {
    folderName: string
    fileName: string
}

export interface UploadedFile {
    buffer: Buffer
    filename: string
    mimeType: string
}
