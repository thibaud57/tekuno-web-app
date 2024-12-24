import { User } from './user.types'

export const ID_USER_MOCK = 'a15s4fs5fs23f2d15fe'

export const userMock: User = {
    id: 'ID_USER_MOCK',
    name: 'John Doe',
    email: 'john@mail.fr',
    avatar: 'https://www.google.com/avatar.png',
    status: 'online',
}

export const user2Mock: User = {
    id: 'id2sfenksnfknsf',
    name: 'Emma Watson',
    email: 'emma@mail.fr',
    avatar: 'https://www.google.com/avatar.png',
    status: 'offline',
}

export const usersMock: User[] = [userMock, user2Mock]
