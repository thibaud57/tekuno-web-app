import { NgFor, NgTemplateOutlet } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatMenuModule } from '@angular/material/menu'
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation'
import {
    AvailableLangs,
    LangDefinition,
    TranslocoService,
} from '@ngneat/transloco'
import { take } from 'rxjs'

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgTemplateOutlet, NgFor],
})
export class LanguagesComponent implements OnInit {
    availableLangs: AvailableLangs
    activeLang: string
    flagCodes: Record<string, string>

    private _fuseNavigationService = inject(FuseNavigationService)
    private _translocoService = inject(TranslocoService)
    private _destroyRef = inject(DestroyRef)

    ngOnInit(): void {
        this.availableLangs = this._translocoService.getAvailableLangs()

        this._translocoService.langChanges$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(activeLang => {
                this.activeLang = activeLang
                this._updateNavigation(activeLang)
            })

        this.flagCodes = {
            fr: 'fr',
            en: 'us',
        }
    }

    setActiveLang(lang: string): void {
        this._translocoService.setActiveLang(lang)
    }

    trackByFn(index: number, item: LangDefinition): string {
        return item.id || index.toString()
    }

    private _updateNavigation(lang: string): void {
        const navComponent =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                'mainNavigation'
            )

        if (!navComponent) {
            return null
        }

        const navigation = navComponent.navigation

        const projectDashboardItem = this._fuseNavigationService.getItem(
            'dashboards.project',
            navigation
        )
        if (projectDashboardItem) {
            this._translocoService
                .selectTranslate('Project')
                .pipe(take(1))
                .subscribe(translation => {
                    projectDashboardItem.title = translation
                    navComponent.refresh()
                })
        }

        const analyticsDashboardItem = this._fuseNavigationService.getItem(
            'dashboards.analytics',
            navigation
        )
        if (analyticsDashboardItem) {
            this._translocoService
                .selectTranslate('Analytics')
                .pipe(take(1))
                .subscribe(translation => {
                    analyticsDashboardItem.title = translation
                    navComponent.refresh()
                })
        }
    }
}
