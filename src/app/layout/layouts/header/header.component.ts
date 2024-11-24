import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import {
    FuseHorizontalNavigationComponent,
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation'
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
export class HeaderComponent {
    @Input() isScreenSmall: boolean
    @Input() isAuthenticated: boolean
    @Input() currentNavigation: FuseNavigationItem[]
    @Input() withSideBar = true

    constructor(private _fuseNavigationService: FuseNavigationService) {}

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
