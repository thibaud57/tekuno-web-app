import { RoleType } from '@backend/auth/enums/role-type.enum'
import { usersMock } from '@backend/users/models/user.mock'
import { SortByRolePipe } from './sort-by-role.pipe'

describe('SortByRolePipe', () => {
    let pipe: SortByRolePipe

    beforeEach(() => {
        pipe = new SortByRolePipe()
    })

    it('should sort users with the ADMIN role first', () => {
        const result = pipe.transform(usersMock, RoleType.ADMIN)
        expect(result[0].roles).toContain(RoleType.ADMIN)
        expect(result[1].roles).not.toContain(RoleType.ADMIN)
    })
})
