import { TypeRole } from 'app/core/user/enums/type-role.enum'
import { usersMock } from 'app/core/user/models/user.mock'
import { SortByRolePipe } from './sort-by-role.pipe'

describe('SortByRolePipe', () => {
    let pipe: SortByRolePipe

    beforeEach(() => {
        pipe = new SortByRolePipe()
    })

    it('should sort users with the ADMIN role first', () => {
        const result = pipe.transform(usersMock, TypeRole.ADMIN)
        expect(result[0].roles).toContain(TypeRole.ADMIN)
        expect(result[1].roles).not.toContain(TypeRole.ADMIN)
    })
})
