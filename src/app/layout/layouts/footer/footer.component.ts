import { Component } from '@angular/core'
import { TranslocoPipe } from '@ngneat/transloco'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [TranslocoPipe],
})
export class FooterComponent {
    readonly TRANSLATION_PREFIX = 'layout.layouts.footer.'

    get currentYear(): number {
        return new Date().getFullYear()
    }
}
