import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common'
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
    inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButton, MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { RouterLink } from '@angular/router'
import { MessagesService } from 'app/layout/common/messages/messages.service'
import { Message } from 'app/layout/common/messages/messages.types'

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'messages',
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NgClass,
        NgTemplateOutlet,
        RouterLink,
        DatePipe,
    ],
})
export class MessagesComponent implements OnInit {
    @ViewChild('messagesOrigin') private _messagesOrigin: MatButton
    @ViewChild('messagesPanel') private _messagesPanel: TemplateRef<Message>

    messages: Message[]
    unreadCount = 0

    private _overlayRef: OverlayRef

    private _changeDetectorRef = inject(ChangeDetectorRef)
    private _messagesService = inject(MessagesService)
    private _overlay = inject(Overlay)
    private _viewContainerRef = inject(ViewContainerRef)
    private _destroyRef = inject(DestroyRef)

    ngOnInit(): void {
        this._messagesService.messages$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((messages: Message[]) => {
                this.messages = messages
                this._calculateUnreadCount()
                this._changeDetectorRef.markForCheck()
            })
    }

    openPanel(): void {
        if (!this._messagesPanel || !this._messagesOrigin) {
            return
        }

        if (!this._overlayRef) {
            this._createOverlay()
        }

        this._overlayRef.attach(
            new TemplatePortal(this._messagesPanel, this._viewContainerRef)
        )
    }

    closePanel(): void {
        this._overlayRef.detach()
    }

    markAllAsRead(): void {
        this._messagesService.markAllAsRead().subscribe()
    }

    toggleRead(message: Message): void {
        message.read = !message.read
        this._messagesService.update(message.id, message).subscribe()
    }

    delete(message: Message): void {
        this._messagesService.delete(message.id).subscribe()
    }

    trackByFn(index: number, item: Message): string | number {
        return item.id || index
    }

    private _createOverlay(): void {
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(
                    this._messagesOrigin._elementRef.nativeElement
                )
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top',
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom',
                    },
                ]),
        })

        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach()
        })
    }

    private _calculateUnreadCount(): void {
        let count = 0

        if (this.messages && this.messages.length) {
            count = this.messages.filter(message => !message.read).length
        }

        this.unreadCount = count
    }
}
