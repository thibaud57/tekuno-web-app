import { Component, ViewEncapsulation } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { TranslocoPipe } from '@ngneat/transloco'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule, TranslocoPipe],
})
export class HomeComponent {
    readonly TRANSLATION_PREFIX = 'module.vitrine.home.'
}
