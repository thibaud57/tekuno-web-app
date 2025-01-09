import { Injectable, computed, signal } from '@angular/core'
import {
    Navigation,
    adminNavigation,
    vitrineNavigation,
} from 'app/core/navigation/navigation'

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private readonly _navigation = signal<Navigation>({
        admin: adminNavigation,
        vitrine: vitrineNavigation,
    })

    readonly admin = computed(() => this._navigation().admin)
    readonly vitrine = computed(() => this._navigation().vitrine)
    readonly navigation = this._navigation.asReadonly()
}
