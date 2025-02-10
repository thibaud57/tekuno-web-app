import { FormControl } from '@angular/forms'

export interface SocialMediaForm {
    facebook: FormControl<string | null>
    instagram: FormControl<string | null>
    website: FormControl<string | null>
    soundcloud: FormControl<string | null>
    spotify: FormControl<string | null>
    beatport: FormControl<string | null>
    bandcamp: FormControl<string | null>
    residentAdvisor: FormControl<string | null>
}
