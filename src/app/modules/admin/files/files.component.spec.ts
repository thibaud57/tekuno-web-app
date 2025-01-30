import { provideHttpClient } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { provideIcons } from 'app/core/icons/icons.provider'
import { FilesComponent } from './files.component'

describe('FilesComponent', () => {
    let component: FilesComponent
    let fixture: ComponentFixture<FilesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FilesComponent],
            providers: [provideIcons(), provideHttpClient()],
        }).compileComponents()

        fixture = TestBed.createComponent(FilesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
