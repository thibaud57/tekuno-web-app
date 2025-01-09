import { Component, inject, ViewEncapsulation } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { TranslocoPipe } from '@ngneat/transloco'
import { UserService } from 'app/core/user/services/user.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule, TranslocoPipe],
})
export class HomeComponent {
    readonly TRANSLATION_PREFIX = 'modules.vitrine.home.'

    private _userService = inject(UserService)

    test() {
        this._userService.getAllUsers().subscribe(users => {
            console.log(users)
        })
    }
}
