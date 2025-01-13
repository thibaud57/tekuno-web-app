import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideIcons } from 'app/core/icons/icons.provider'
import { AvatarComponent } from './avatar.component'

describe('AvatarComponent', () => {
    let component: AvatarComponent
    let fixture: ComponentFixture<AvatarComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AvatarComponent],
            providers: [provideIcons(), provideHttpClient()],
        }).compileComponents()

        fixture = TestBed.createComponent(AvatarComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should display default icon when no avatar is provided', () => {
        const icon = fixture.debugElement.query(By.css('mat-icon'))
        const img = fixture.debugElement.query(By.css('img'))

        expect(icon).toBeTruthy()
        expect(img).toBeFalsy()
    })

    it('should display avatar image when avatar is provided', () => {
        const avatarUrl = 'test-avatar.jpg'
        fixture.componentRef.setInput('avatar', avatarUrl)
        fixture.detectChanges()

        const icon = fixture.debugElement.query(By.css('mat-icon'))
        const img = fixture.debugElement.query(By.css('img'))

        expect(icon).toBeFalsy()
        expect(img).toBeTruthy()
        expect(img.attributes['src']).toBe(avatarUrl)
        expect(img.attributes['alt']).toBe('Avatar')
    })
})
