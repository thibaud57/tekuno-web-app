import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterOutlet } from '@angular/router'
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar'
import {
    FuseNavigationItem,
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import { Subject, takeUntil } from 'rxjs'
import { FooterComponent } from '../../footer/footer.component'
import { HeaderComponent } from '../../header/header.component'

@Component({
    selector: 'app-classic-layout',
    templateUrl: './classic.component.html',
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
export class ClassicLayoutComponent implements OnInit, OnDestroy {
    @Input() isAuthenticated: boolean
    @Input() currentNavigation: FuseNavigationItem[]

    isScreenSmall: boolean

    private _unsubscribeAll: Subject<any> = new Subject<any>()

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {}

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md')
            })
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null)
        this._unsubscribeAll.complete()
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
