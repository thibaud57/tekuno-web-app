import { Injectable } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { SocialMediaForm } from './social-media-form.model'

@Injectable({ providedIn: 'root' })
export class SocialMediaFormService {
    createForm(): FormGroup<SocialMediaForm> {
        return new FormGroup<SocialMediaForm>({
            facebook: new FormControl(null),
            instagram: new FormControl(null),
            website: new FormControl(null),
            soundcloud: new FormControl(null),
            spotify: new FormControl(null),
            beatport: new FormControl(null),
            bandcamp: new FormControl(null),
            residentAdvisor: new FormControl(null),
        })
    }
}
