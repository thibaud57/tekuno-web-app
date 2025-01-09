import { CommonModule, DOCUMENT } from '@angular/common'
import {
    Component,
    DestroyRef,
    OnInit,
    Renderer2,
    ViewEncapsulation,
    inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { FuseNavigationItem } from '@fuse/components/navigation'
import { FuseConfig, FuseConfigService } from '@fuse/services/config'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import { FusePlatformService } from '@fuse/services/platform'
import { FUSE_VERSION } from '@fuse/version'
import { AuthService } from 'app/core/auth/services/auth.service'
import { Navigation } from 'app/core/navigation/navigation'
import { NavigationService } from 'app/core/navigation/navigation.service'
import { Observable, combineLatest, filter, map } from 'rxjs'
import { SettingsComponent } from './common/settings/settings.component'
import { EmptyLayoutComponent } from './layouts/empty/empty.component'
import { TypeLayout } from './layouts/enums/type-layout.enum'
import { TypeScheme } from './layouts/enums/type-scheme.enum'
import { ModernLayoutComponent } from './layouts/horizontal/modern/modern.component'
import { ClassicLayoutComponent } from './layouts/vertical/classic/classic.component'
import { CompactLayoutComponent } from './layouts/vertical/compact/compact.component'

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        EmptyLayoutComponent,
        ModernLayoutComponent,
        ClassicLayoutComponent,
        CompactLayoutComponent,
        SettingsComponent,
        CommonModule,
    ],
})
export class LayoutComponent implements OnInit {
    config: FuseConfig
    layout: TypeLayout = TypeLayout.MODERN
    scheme: TypeScheme
    theme: string
    navigation: Navigation

    isAuthenticated$: Observable<boolean>
    currentNavigation$: Observable<FuseNavigationItem[]>
    isScreenSmall$: Observable<boolean>

    protected TypeLayout = TypeLayout

    private _activatedRoute = inject(ActivatedRoute)
    private _document = inject(DOCUMENT)
    private _renderer2 = inject(Renderer2)
    private _router = inject(Router)
    private _fuseConfigService = inject(FuseConfigService)
    private _fuseMediaWatcherService = inject(FuseMediaWatcherService)
    private _fusePlatformService = inject(FusePlatformService)
    private _authService = inject(AuthService)
    private _navigationService = inject(NavigationService)
    private _destroyRef = inject(DestroyRef)

    ngOnInit(): void {
        this.isAuthenticated$ = this._authService.check()
        this.currentNavigation$ = this.getCurrentNavigation()
        this.isScreenSmall$ = this._fuseMediaWatcherService.onMediaChange$.pipe(
            map(({ matchingAliases }) => !matchingAliases.includes('md'))
        )

        combineLatest([
            this._fuseConfigService.config$,
            this._fuseMediaWatcherService.onMediaQueryChange$([
                '(prefers-color-scheme: dark)',
                '(prefers-color-scheme: light)',
            ]),
        ])
            .pipe(
                map(([config, mql]) => {
                    const options = {
                        scheme: config.scheme,
                        theme: config.theme,
                    }

                    if (config.scheme === TypeScheme.AUTO) {
                        options.scheme = mql.breakpoints[
                            '(prefers-color-scheme: dark)'
                        ]
                            ? TypeScheme.DARK
                            : TypeScheme.LIGHT
                    }

                    return options
                }),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(options => {
                this.scheme = options.scheme
                this.theme = options.theme
                this._updateScheme()
                this._updateTheme()
            })

        this._fuseConfigService.config$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((config: FuseConfig) => {
                this.config = config
                this._updateLayout()
            })

        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed(this._destroyRef)
            )
            .subscribe(() => {
                this._updateLayout()
            })

        this._renderer2.setAttribute(
            this._document.querySelector('[ng-version]'),
            'fuse-version',
            FUSE_VERSION
        )

        this._renderer2.addClass(
            this._document.body,
            this._fusePlatformService.osName
        )
    }

    private _updateLayout(): void {
        let route = this._activatedRoute
        while (route.firstChild) {
            route = route.firstChild
        }

        this.layout = this.config.layout

        const layoutFromQueryParam = route.snapshot.queryParamMap.get(
            'layout'
        ) as TypeLayout

        if (layoutFromQueryParam) {
            this.layout = layoutFromQueryParam
            if (this.config) {
                this.config.layout = layoutFromQueryParam
            }
        }

        const paths = route.pathFromRoot
        paths.forEach(path => {
            if (
                path.routeConfig &&
                path.routeConfig.data &&
                path.routeConfig.data.layout
            ) {
                this.layout = path.routeConfig.data.layout
            }
        })
    }

    private _updateScheme(): void {
        this._document.body.classList.remove(TypeScheme.LIGHT, TypeScheme.DARK)
        this._document.body.classList.add(this.scheme)
    }

    private _updateTheme(): void {
        this._document.body.classList.forEach((className: string) => {
            if (className.startsWith('theme-')) {
                this._document.body.classList.remove(
                    className,
                    className.split('-')[1]
                )
            }
        })

        this._document.body.classList.add(this.theme)
    }

    private getCurrentNavigation(): Observable<FuseNavigationItem[]> {
        const navigation$ = this._navigationService.navigation$
        return combineLatest([navigation$, this.isAuthenticated$]).pipe(
            map(([navigation, isAuthenticated]) =>
                isAuthenticated ? navigation.admin : navigation.vitrine
            )
        )
    }
}
