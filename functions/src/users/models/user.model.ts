import { TypeRole } from '../../auth/enums/type-role.enum'
import { BaseModel } from '../../shared/models/base.model'

export interface UserEntity extends BaseModel {
    id: string
    email: string
    roles: TypeRole[]
    displayName?: string
    avatar?: string
}

export interface CreateUserDto {
    email: string
    password: string
    roles: TypeRole[]
}
