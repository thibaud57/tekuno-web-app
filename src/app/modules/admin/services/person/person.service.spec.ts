import { provideHttpClient, withFetch } from '@angular/common/http'
import { HttpTestingController } from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { membersMock } from '@backend/persons/models/person.mock'
import { environment } from 'environments/environment'
import { PersonService } from './person.service'

describe('PersonService', () => {
    let service: PersonService
    let httpMock: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PersonService, provideHttpClient(withFetch())],
        })

        service = TestBed.inject(PersonService)
        httpMock = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
        httpMock.verify()
    })

    describe('getPersons', () => {
        it('should return persons list', () => {
            service.getPersons().subscribe(persons => {
                expect(persons).toEqual(membersMock)
            })

            const req = httpMock.expectOne(`${environment.apiBaseUrl}/persons`)
            expect(req.request.method).toBe('GET')
            req.flush(membersMock)
        })
    })
})
