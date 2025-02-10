import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { TranslocoPipe } from '@ngneat/transloco'
import { SocialMediaFormType } from 'app/shared/enums/social-media-form-type.enum'
import { SocialMediaType } from 'app/shared/enums/social-media-type.enum'
import { SocialMediaForm } from '../../services/social-media-form/social-media-form.model'

@Component({
    selector: 'app-social-media-form',
    templateUrl: './social-media-form.component.html',
    styleUrls: ['./social-media-form.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TranslocoPipe,
        CommonModule,
    ],
})
export class SocialMediaFormComponent {
    readonly TRANSLATION_PREFIX = 'shared.social-media-form.'

    @Input({ required: true }) form!: FormGroup<SocialMediaForm>
    @Input() typeSocialMediaForm: SocialMediaFormType =
        SocialMediaFormType.NORMAL

    readonly socialMedias = [
        {
            key: SocialMediaType.FACEBOOK,
            controlName: 'facebook',
            logo: 'Facebook',
            placeholder: 'https://facebook.com/page',
        },
        {
            key: SocialMediaType.INSTAGRAM,
            controlName: 'instagram',
            logo: 'Instagram',
            placeholder: 'https://instagram.com/profile',
        },
        {
            key: SocialMediaType.WEBSITE,
            controlName: 'website',
            logo: 'Website',
            placeholder: 'https://website.com',
        },
        {
            key: SocialMediaType.SOUNDCLOUD,
            controlName: 'soundcloud',
            logo: 'Soundcloud',
            placeholder: 'https://soundcloud.com/profile',
        },
        {
            key: SocialMediaType.SPOTIFY,
            controlName: 'spotify',
            logo: 'Spotify',
            placeholder: 'https://open.spotify.com/artist/id',
        },
        {
            key: SocialMediaType.BEATPORT,
            controlName: 'beatport',
            logo: 'Beatport',
            placeholder: 'https://www.beatport.com/artist/name',
        },
        {
            key: SocialMediaType.BANDCAMP,
            controlName: 'bandcamp',
            logo: 'Bandcamp',
            placeholder: 'https://dj-name.bandcamp.com',
        },
        {
            key: SocialMediaType.RESIDENT_ADVISOR,
            controlName: 'residentAdvisor',
            logo: 'ResidentAdvisor',
            placeholder:
                this.typeSocialMediaForm === SocialMediaFormType.DJ
                    ? 'https://ra.co/dj/dj-name'
                    : 'https://ra.co/events/event-name',
        },
    ]

    getLogo(network: string): string {
        return `/images/social-medias/${network}.svg`
    }

    isMediaVisible(network: SocialMediaType): boolean {
        const djMedias = [
            SocialMediaType.SOUNDCLOUD,
            SocialMediaType.SPOTIFY,
            SocialMediaType.BEATPORT,
            SocialMediaType.BANDCAMP,
            SocialMediaType.RESIDENT_ADVISOR,
        ]
        const eventMedias = [SocialMediaType.RESIDENT_ADVISOR]

        switch (this.typeSocialMediaForm) {
            case SocialMediaFormType.DJ:
                return true
            case SocialMediaFormType.EVENT:
                return (
                    !djMedias.includes(network) || eventMedias.includes(network)
                )
            default:
                return (
                    !djMedias.includes(network) &&
                    !eventMedias.includes(network)
                )
        }
    }
}
