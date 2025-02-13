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

    uploadPicture(file: File, path: string): Observable<string> {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('path', path)

        return this.http.post<string>(`${this.apiUrl}/storage/upload`, formData)
    }
}
