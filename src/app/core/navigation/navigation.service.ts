import { Injectable } from '@angular/core'
import {
    adminNavigation,
    Navigation,
    vitrineNavigation,
} from 'app/core/navigation/navigation'
import { Observable, ReplaySubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1)

    constructor() {
        // Initialize navigation immediately
        this.get().subscribe()
    }

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable()
    }

    get(): Observable<Navigation> {
        const navigation: Navigation = {
            admin: adminNavigation,
            vitrine: vitrineNavigation,
        }
        return new Observable<Navigation>(observer => {
            this._navigation.next(navigation)
            observer.next(navigation)
            observer.complete()
        })
    }
}
