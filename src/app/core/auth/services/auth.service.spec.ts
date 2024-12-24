import { TestBed } from '@angular/core/testing'
import { UserServiceMock } from 'app/core/user/services/user.service.mock'
import { UserService } from '../../user/services/user.service'
import { AuthService } from './auth.service'

describe('AuthService', () => {
    let service: AuthService
    let userService: UserService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useClass: UserServiceMock },
            ],
        })

        service = TestBed.inject(AuthService)
        userService = TestBed.inject(UserService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
