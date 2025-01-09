import { NgClass, NgTemplateOutlet } from '@angular/common'
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    Input,
    OnInit,
    inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatTooltipModule } from '@angular/material/tooltip'
import {
    IsActiveMatchOptions,
    RouterLink,
    RouterLinkActive,
} from '@angular/router'
import { FuseHorizontalNavigationComponent } from '@fuse/components/navigation/horizontal/horizontal.component'
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service'
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types'
import { FuseUtilsService } from '@fuse/services/utils/utils.service'
import { TranslocoPipe } from '@ngneat/transloco'

@Component({
    selector: 'fuse-horizontal-navigation-basic-item',
    templateUrl: './basic.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        RouterLinkActive,
        MatTooltipModule,
        NgTemplateOutlet,
        MatMenuModule,
        MatIconModule,
        TranslocoPipe,
    ],
})
export class FuseHorizontalNavigationBasicItemComponent implements OnInit {
    @Input() item: FuseNavigationItem
    @Input() name: string

    isActiveMatchOptions: IsActiveMatchOptions

    private _fuseHorizontalNavigationComponent: FuseHorizontalNavigationComponent
    private _changeDetectorRef = inject(ChangeDetectorRef)
    private _fuseNavigationService = inject(FuseNavigationService)
    private _fuseUtilsService = inject(FuseUtilsService)
    private _destroyRef = inject(DestroyRef)

    ngOnInit(): void {
        this.isActiveMatchOptions =
            this.item.isActiveMatchOptions ?? this.item.exactMatch
                ? this._fuseUtilsService.exactMatchOptions
                : this._fuseUtilsService.subsetMatchOptions

        this._fuseHorizontalNavigationComponent =
            this._fuseNavigationService.getComponent(this.name)

        this._changeDetectorRef.markForCheck()

        this._fuseHorizontalNavigationComponent.onRefreshed
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => {
                this._changeDetectorRef.markForCheck()
            })
    }
}
