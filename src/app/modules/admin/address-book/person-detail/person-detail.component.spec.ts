import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { personMember2Mock } from 'app/shared/models/person.mock'
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
        component.person = personMember2Mock
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
        expect(compiled.textContent).toContain(personMember2Mock.firstName)
        expect(compiled.textContent).toContain(personMember2Mock.name)
        expect(compiled.textContent).toContain(personMember2Mock.email)
    })
})
