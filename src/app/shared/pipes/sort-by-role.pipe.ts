import { Pipe, PipeTransform } from '@angular/core'
import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { User } from 'app/core/user/models/user.model'

@Pipe({
    name: 'sortByRole',
    standalone: true,
})
export class SortByRolePipe implements PipeTransform {
    transform(users: User[], roleToSort: TypeRole): User[] {
        if (!users) return []

        return [...users].sort((a, b) => {
            const aHasRole = a.roles.includes(roleToSort)
            const bHasRole = b.roles.includes(roleToSort)

            if (aHasRole && !bHasRole) return -1
            if (!aHasRole && bHasRole) return 1
            return 0
        })
    }
}
