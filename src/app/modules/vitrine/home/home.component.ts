import { Component, ViewEncapsulation } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { TranslocoModule, TranslocoPipe } from '@ngneat/transloco'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink,
        MatIconModule,
        TranslocoPipe,
        TranslocoModule,
    ],
})
export class HomeComponent {
    readonly TRANSLATION_PREFIX = 'vitrine.home.'
}
