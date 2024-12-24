import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { AuthService } from 'app/core/auth/services/auth.service'
import { AuthServiceMock } from 'app/core/auth/services/auth.service.mock'
import { of } from 'rxjs'
import { getTranslocoModule } from '../../../core/transloco/transloco-testing.module'
import { AuthSignOutComponent } from './sign-out.component'

describe('AuthSignOutComponent', () => {
    let component: AuthSignOutComponent
    let fixture: ComponentFixture<AuthSignOutComponent>
    let authService: AuthService
    let router: Router

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuthSignOutComponent, getTranslocoModule()],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                provideRouter([
                    {
                        path: '',
                        component: AuthSignOutComponent,
                    },
                ]),
            ],
        }).compileComponents()

        fixture = TestBed.createComponent(AuthSignOutComponent)
        component = fixture.componentInstance
        authService = TestBed.inject(AuthService)
        router = TestBed.inject(Router)
        fixture.detectChanges()
    })

    it('should sign out and start countdown on init', () => {
        spyOn(authService, 'signOut').and.returnValue(of(void 0))

        component.ngOnInit()

        expect(authService.signOut).toHaveBeenCalled()
        expect(component.countdown).toBe(5)
    })

    it('should navigate to sign-in after countdown', fakeAsync(() => {
        spyOn(router, 'navigate')

        component.countdown = 1
        component.ngOnInit()

        tick(3000)

        expect(router.navigate).toHaveBeenCalledWith(['sign-in'])
    }))
})
