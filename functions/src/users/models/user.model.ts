import { RoleType } from '../../auth/enums/role-type.enum'
import { BaseModel } from '../../shared/models/base.model'

export interface User extends BaseModel {
    id: string
    email: string
    roles: RoleType[]
    displayName?: string
    avatar?: string
}

export interface CreateUserDto {
    email: string
    password: string
    roles: RoleType[]
}
