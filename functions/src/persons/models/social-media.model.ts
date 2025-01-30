export interface SocialMedia {
    facebook?: string
    instagram?: string
    website?: string
}

export interface SocialMediaDj extends SocialMedia {
    soundcloud?: string
    spotify?: string
    beatport?: string
    bandcamp?: string
    residentadvisor?: string
}

// TODO: A implémenter lors de la création des événements
export interface SocialMediaEvent extends SocialMedia {
    residentadvisor?: string
}
