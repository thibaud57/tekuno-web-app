import { Component, input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './avatar.component.html',
})
export class AvatarComponent {
    avatar = input<string>()
}
