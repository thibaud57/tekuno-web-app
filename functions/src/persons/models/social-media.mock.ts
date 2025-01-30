import {
    SocialMedia,
    SocialMediaDj,
    SocialMediaEvent,
} from './social-media.model'

export const socialMediaMock: SocialMedia = {
    facebook: 'https://facebook.com/basic',
    instagram: 'https://instagram.com/basic',
    website: 'https://www.basic-website.com',
}

export const socialMediaDjMock: SocialMediaDj = {
    facebook: 'https://facebook.com/dj',
    instagram: 'https://instagram.com/dj',
    website: 'https://www.dj-website.com',
    soundcloud: 'https://soundcloud.com/dj',
    spotify: 'https://open.spotify.com/artist/dj',
    beatport: 'https://www.beatport.com/artist/dj',
    bandcamp: 'https://dj.bandcamp.com',
    residentadvisor: 'https://ra.co/dj/artist',
}

export const socialMediaEventMock: SocialMediaEvent = {
    facebook: 'https://facebook.com/event',
    instagram: 'https://instagram.com/event',
    website: 'https://www.event-website.com',
    residentadvisor: 'https://ra.co/events/123456',
}
