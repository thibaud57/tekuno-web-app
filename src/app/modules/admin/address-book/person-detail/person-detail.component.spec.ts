import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { member2RolesMock } from '@backend/persons/models/person-entity.mock'
import { PersonDetailComponent } from './person-detail.component'

describe('PersonDetailComponent', () => {
    let component: PersonDetailComponent
    let fixture: ComponentFixture<PersonDetailComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PersonDetailComponent],
            providers: [provideHttpClient()],
        }).compileComponents()

        fixture = TestBed.createComponent(PersonDetailComponent)
        component = fixture.componentInstance
        component.person = member2RolesMock
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should emit close event when onClose is called', () => {
        const closeSpy = spyOn(component.close, 'emit')
        component.onClose()
        expect(closeSpy).toHaveBeenCalled()
    })

    it('should display person information', () => {
        const compiled = fixture.nativeElement
        expect(compiled.textContent).toContain(member2RolesMock.firstName)
        expect(compiled.textContent).toContain(member2RolesMock.name)
        expect(compiled.textContent).toContain(member2RolesMock.email)
    })
})
