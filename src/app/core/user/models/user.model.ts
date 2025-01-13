import { TypeRole } from '../enums/type-role.enum'

export interface User {
    id: string
    email: string
    roles: TypeRole[]
    displayName?: string
    avatar?: string
}

export interface CreateUser {
    email: string
    password: string
    roles: TypeRole[]
}
