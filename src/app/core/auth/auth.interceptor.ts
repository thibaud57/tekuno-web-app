import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthUtils } from 'app/core/auth/auth.utils'
import { AuthService } from 'app/core/auth/services/auth.service'
import { Observable, catchError, throwError } from 'rxjs'

export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService)

    let newReq = req.clone()

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (
        authService.accessToken &&
        !AuthUtils.isTokenExpired(authService.accessToken)
    ) {
        newReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + authService.accessToken
            ),
        })
    }

    return next(newReq).pipe(
        catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.signOut()
                location.reload()
            }

            return throwError(() => error)
        })
    )
}
