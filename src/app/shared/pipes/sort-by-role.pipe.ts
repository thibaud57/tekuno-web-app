import { Pipe, PipeTransform } from '@angular/core'
import { RoleType } from '@backend/auth/enums/role-type.enum'
import { User } from '@backend/users/models/user.model'

@Pipe({
    name: 'sortByRole',
    standalone: true,
})
export class SortByRolePipe implements PipeTransform {
    transform(users: User[], roleToSort: RoleType): User[] {
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
