import { inject } from '@angular/core'
import { NavigationService } from 'app/core/navigation/navigation.service'
import { MessagesService } from 'app/layout/common/messages/messages.service'
import { forkJoin, of } from 'rxjs'

export const initialDataResolver = () => {
    const messagesService = inject(MessagesService)
    const navigationService = inject(NavigationService)

    return forkJoin([
        of({
            admin: navigationService.admin(),
            vitrine: navigationService.vitrine(),
        }),
        messagesService.getAll(),
    ])
}
