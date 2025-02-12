import { Injectable } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { SocialMedia } from '@backend/persons/models/social-media/social-media.model'
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

    getSocialMedia(form: FormGroup<SocialMediaForm>): SocialMedia | undefined {
        const formValue = form.value

        if (
            !formValue.facebook &&
            !formValue.instagram &&
            !formValue.website &&
            !formValue.soundcloud &&
            !formValue.spotify &&
            !formValue.beatport &&
            !formValue.bandcamp &&
            !formValue.residentAdvisor
        ) {
            return undefined
        }

        return {
            facebook: formValue.facebook,
            instagram: formValue.instagram,
            website: formValue.website,
            soundcloud: formValue.soundcloud,
            spotify: formValue.spotify,
            beatport: formValue.beatport,
            bandcamp: formValue.bandcamp,
            residentAdvisor: formValue.residentAdvisor,
        }
    }
}
