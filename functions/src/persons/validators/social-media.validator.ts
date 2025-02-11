import { z } from 'zod'

const facebookSchema = z
    .string()
    .url('Invalid Facebook URL')
    .regex(
        /^https:\/\/(www\.)?facebook\.com\/.*$/,
        'Must be a valid Facebook URL'
    )
    .nullish()
const instagramSchema = z
    .string()
    .url('Invalid Instagram URL')
    .regex(
        /^https:\/\/(www\.)?instagram\.com\/.*$/,
        'Must be a valid Instagram URL'
    )
    .nullish()
const soundcloudSchema = z
    .string()
    .url('Invalid Soundcloud URL')
    .regex(
        /^https:\/\/(www\.)?soundcloud\.com\/.*$/,
        'Must be a valid Soundcloud URL'
    )
    .nullish()
const spotifySchema = z
    .string()
    .url('Invalid Spotify URL')
    .regex(
        /^https:\/\/(www\.)?open\.spotify\.com\/artist\/.*$/,
        'Must be a valid Spotify artist URL'
    )
    .nullish()
const beatportSchema = z
    .string()
    .url('Invalid Beatport URL')
    .regex(
        /^https:\/\/(www\.)?beatport\.com\/artist\/.*$/,
        'Must be a valid Beatport artist URL'
    )
    .nullish()
const bandcampSchema = z
    .string()
    .url('Invalid Bandcamp URL')
    .regex(
        /^https:\/\/(www\.)?(.*\.)?bandcamp\.com(\/.*)?$/,
        'Must be a valid Bandcamp URL'
    )
    .nullish()
const residentAdvisorDjSchema = z
    .string()
    .url('Invalid RA URL')
    .regex(/^https:\/\/(www\.)?ra\.co\/dj\/.*$/, 'Must be a valid RA DJ URL')
    .nullish()
const residentAdvisorEventSchema = z
    .string()
    .url('Invalid RA URL')
    .regex(
        /^https:\/\/(www\.)?ra\.co\/events\/.*$/,
        'Must be a valid RA event URL'
    )
    .nullish()
const websiteSchema = z.string().url('Invalid website URL').nullish()

export const djSocialMediaSchema = z
    .object({
        facebook: facebookSchema,
        instagram: instagramSchema,
        soundcloud: soundcloudSchema,
        spotify: spotifySchema,
        beatport: beatportSchema,
        bandcamp: bandcampSchema,
        residentAdvisor: residentAdvisorDjSchema,
        website: websiteSchema,
    })
    .nullish()

export const eventSocialMediaSchema = z
    .object({
        facebook: facebookSchema,
        instagram: instagramSchema,
        residentAdvisor: residentAdvisorEventSchema,
        website: websiteSchema,
    })
    .nullish()

export const basicSocialMediaSchema = z
    .object({
        facebook: facebookSchema,
        instagram: instagramSchema,
        website: websiteSchema,
    })
    .nullish()

export const socialMediaSchema = z.union([
    djSocialMediaSchema,
    eventSocialMediaSchema,
    basicSocialMediaSchema,
])
