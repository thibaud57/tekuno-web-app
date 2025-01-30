import { provideHttpClient, withFetch } from '@angular/common/http'
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { RoleType } from '@backend/auth/enums/role-type.enum'
import { userAdminMock, usersMock } from '@backend/users/models/user.mock'
import { UserService } from './user.service'

describe('UserService', () => {
    let service: UserService
    let httpMock: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserService,
                provideHttpClient(withFetch()),
                provideHttpClientTesting(),
            ],
        })

        service = TestBed.inject(UserService)
        httpMock = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
        httpMock.verify()
    })

    describe('getUsers', () => {
        it('should return list of users', done => {
            service.getUsers().subscribe(users => {
                expect(users).toEqual(usersMock)
                done()
            })

            const req = httpMock.expectOne(service['apiUrl'])
            expect(req.request.method).toBe('GET')
            req.flush(usersMock)
        })
    })

    describe('getUser', () => {
        it('should return user by id', done => {
            service.getUser(userAdminMock.id).subscribe(user => {
                expect(user).toEqual(userAdminMock)
                done()
            })

            const req = httpMock.expectOne(
                `${service['apiUrl']}/${userAdminMock.id}`
            )
            expect(req.request.method).toBe('GET')
            req.flush(userAdminMock)
        })
    })

    describe('hasRole', () => {
        it('should return true when user has required role', () => {
            service.user.set({
                ...userAdminMock,
                roles: [RoleType.ADMIN],
            })

            expect(service.hasRole(RoleType.ADMIN)).toBeTruthy()
        })

        it('should return false when user does not have required role', () => {
            service.user.set({
                ...userAdminMock,
                roles: [RoleType.MEMBER],
            })

            expect(service.hasRole(RoleType.ADMIN)).toBeFalsy()
        })

        it('should return false when user has no roles', () => {
            service.user.set({
                ...userAdminMock,
                roles: [],
            })

            expect(service.hasRole(RoleType.ADMIN)).toBeFalsy()
        })

        it('should return false when no user is set', () => {
            service.user.set(null)

            expect(service.hasRole(RoleType.ADMIN)).toBeFalsy()
        })
    })

    describe('createUser', () => {
        it('should create new user', done => {
            const newUser = {
                ...userAdminMock,
                id: 'new-user-id',
                password: 'test-password',
            }

            service.createUser(newUser).subscribe(() => done())

            const req = httpMock.expectOne(service['apiUrl'])
            expect(req.request.method).toBe('POST')
            expect(req.request.body).toEqual(newUser)
            req.flush(newUser)
        })
    })

    describe('updateUser', () => {
        it('should update existing user', done => {
            const updatedUser = {
                ...userAdminMock,
                displayName: 'Updated Name',
                roles: [RoleType.ADMIN, RoleType.MEMBER],
            }

            service.updateUser(updatedUser).subscribe(() => done())

            const req = httpMock.expectOne(
                `${service['apiUrl']}/${updatedUser.id}`
            )
            expect(req.request.method).toBe('PATCH')
            expect(req.request.body).toEqual(updatedUser)
            req.flush(updatedUser)
        })

        it('should update user roles', done => {
            const updatedUser = {
                ...userAdminMock,
                roles: [RoleType.ADMIN, RoleType.DJ],
            }

            service.updateUser(updatedUser).subscribe(() => done())

            const req = httpMock.expectOne(
                `${service['apiUrl']}/${updatedUser.id}`
            )
            expect(req.request.method).toBe('PATCH')
            expect(req.request.body).toEqual(updatedUser)
            req.flush(updatedUser)
        })
    })

    describe('deleteUser', () => {
        it('should delete user by id', done => {
            service.deleteUser(userAdminMock.id).subscribe(() => done())

            const req = httpMock.expectOne(
                `${service['apiUrl']}/${userAdminMock.id}`
            )
            expect(req.request.method).toBe('DELETE')
            req.flush({})
        })
    })
})
