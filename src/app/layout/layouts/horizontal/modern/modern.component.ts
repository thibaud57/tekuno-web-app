import { Component, Input, ViewEncapsulation } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterOutlet } from '@angular/router'
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar'
import {
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation'
import { FooterComponent } from '../../footer/footer.component'
import { HeaderComponent } from '../../header/header.component'

@Component({
    selector: 'app-modern-layout',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        MatButtonModule,
        MatIconModule,
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
    ],
})
export class ModernLayoutComponent {
    @Input() isAuthenticated: boolean
    @Input() currentNavigation: FuseNavigationItem[]
    @Input() isScreenSmall: boolean

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
