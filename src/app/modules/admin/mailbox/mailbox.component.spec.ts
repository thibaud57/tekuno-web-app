import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideIcons } from 'app/core/icons/icons.provider'
import { MailboxComponent } from './mailbox.component'

describe('MailboxComponent', () => {
    let component: MailboxComponent
    let fixture: ComponentFixture<MailboxComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MailboxComponent],
            providers: [provideIcons(), provideHttpClient()],
        }).compileComponents()

        fixture = TestBed.createComponent(MailboxComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
