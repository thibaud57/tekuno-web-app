import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatIconModule } from '@angular/material/icon'
import { provideAnimations } from '@angular/platform-browser/animations'
import { FuseDrawerComponent } from '@fuse/components/drawer'
import { SettingsComponent } from './settings.component'

describe('SettingsComponent', () => {
    let component: SettingsComponent
    let fixture: ComponentFixture<SettingsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatIconModule, FuseDrawerComponent, SettingsComponent],
            providers: [provideAnimations()],
        }).compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(SettingsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
