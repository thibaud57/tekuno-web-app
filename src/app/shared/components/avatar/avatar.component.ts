import { Component, input, output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatRippleModule } from '@angular/material/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
    selector: 'app-avatar',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, MatRippleModule],
    templateUrl: './avatar.component.html',
})
export class AvatarComponent {
    readonly ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png'].join(', ')
    readonly MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

    avatar = input<string>()
    size = input<number>(40)
    showUploadButton = input<boolean>(false)

    uploadAvatar = output<File>()
    deleteAvatar = output<void>()

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]

        if (!file) {
            return
        }

        if (file.size > this.MAX_FILE_SIZE) {
            input.value = ''
            throw new Error(
                `File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit`
            )
        }

        if (!this.ACCEPTED_FILE_TYPES.includes(file.type)) {
            input.value = ''
            throw new Error(
                `Invalid file type. Accepted types: ${this.ACCEPTED_FILE_TYPES}`
            )
        }

        this.uploadAvatar.emit(file)
        input.value = ''
    }

    onDelete(event: MouseEvent): void {
        event.preventDefault()
        event.stopPropagation()
        this.deleteAvatar.emit()
    }
}
