import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { getTranslocoModule } from 'app/core/translation/transloco/transloco-testing.module'
import { AddressBookComponent } from './address-book.component'

describe('AddressBookComponent', () => {
    let component: AddressBookComponent
    let fixture: ComponentFixture<AddressBookComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AddressBookComponent, getTranslocoModule()],
            providers: [provideHttpClient()],
        }).compileComponents()

        fixture = TestBed.createComponent(AddressBookComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
