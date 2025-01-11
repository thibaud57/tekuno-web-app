import { coerceBooleanProperty } from '@angular/cdk/coercion'
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { FuseLoadingService } from '@fuse/services/loading'
import { Subject, takeUntil } from 'rxjs'

@Component({
    selector: 'fuse-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    exportAs: 'fuseLoadingBar',
    standalone: true,
    imports: [MatProgressBarModule],
})
export class FuseLoadingBarComponent
    implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
    private _fuseLoadingService = inject(FuseLoadingService)
    private _changeDetectorRef = inject(ChangeDetectorRef)
    private _ngZone = inject(NgZone)

    @Input() autoMode = true
    mode: 'determinate' | 'indeterminate'
    progress = 0
    show = false
    private _unsubscribeAll: Subject<any> = new Subject<any>()

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Auto mode
        if ('autoMode' in changes) {
            // Set the auto mode in the service
            this._fuseLoadingService.setAutoMode(
                coerceBooleanProperty(changes.autoMode.currentValue)
            )
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this._ngZone.runOutsideAngular(() => {
            this._fuseLoadingService.mode$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(value => {
                    this._ngZone.run(() => {
                        this.mode = value
                        this._changeDetectorRef.detectChanges()
                    })
                })

            this._fuseLoadingService.progress$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(value => {
                    this._ngZone.run(() => {
                        this.progress = value
                        this._changeDetectorRef.detectChanges()
                    })
                })

            this._fuseLoadingService.show$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(value => {
                    this._ngZone.run(() => {
                        this.show = value
                        this._changeDetectorRef.detectChanges()
                    })
                })
        })
    }

    ngAfterViewInit(): void {
        this._changeDetectorRef.detectChanges()
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null)
        this._unsubscribeAll.complete()
    }
}
