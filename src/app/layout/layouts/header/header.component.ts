import { CommonModule } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import {
    FuseHorizontalNavigationComponent,
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation'
import { AuthService } from 'app/core/auth/auth.service'
import { NavigationType } from 'app/core/navigation/enums/typeNavigation.enum'
import { Navigation } from 'app/core/navigation/navigation.types'
import { Observable, map } from 'rxjs'
import { LanguagesComponent } from '../../common/languages/languages.component'
import { MessagesComponent } from '../../common/messages/messages.component'
import { UserComponent } from '../../common/user/user.component'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [
        LanguagesComponent,
        MessagesComponent,
        UserComponent,
        CommonModule,
        FuseHorizontalNavigationComponent,
    ],
})
export class HeaderComponent implements OnInit {
    @Input() isScreenSmall: boolean
    @Input() navigation: Navigation
    @Input() withSideBar = true

    isAuthenticated$: Observable<boolean>
    currentNavigation: FuseNavigationItem[] = []

    constructor(
        private _fuseNavigationService: FuseNavigationService,
        private _authService: AuthService
    ) {
        this.isAuthenticated$ = this._authService.check()
    }

    ngOnInit(): void {
        this.isAuthenticated$
            .pipe(
                map(isAuthenticated => {
                    const filterType = isAuthenticated
                        ? NavigationType.ADMIN
                        : NavigationType.VITRINE
                    this.currentNavigation = this.navigation.horizontal.filter(
                        item => item.meta === filterType
                    )
                })
            )
            .subscribe()
    }

    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            )

        if (navigation) {
            // Toggle the opened status
            navigation.toggle()
        }
    }
}
