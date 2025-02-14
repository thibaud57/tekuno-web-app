import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environments/environment'

@Injectable({
    providedIn: 'root',
})
export class UploadService {
    private readonly http = inject(HttpClient)

    private readonly apiUrl = environment.apiBaseUrl

    uploadFile(
        file: File,
        folderName: string,
        fileName: string
    ): Observable<{ url: string }> {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folderName', folderName)
        formData.append('fileName', fileName)

        return this.http.post<{ url: string }>(
            `${this.apiUrl}/storage/upload`,
            formData
        )
    }

    deleteFile(url: string, folderName: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/storage/delete`, {
            url,
            folderName,
        })
    }
}
