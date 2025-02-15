import { z } from 'zod'
import { RoleType } from '../../auth/enums/role-type.enum'
import { CorrespondentType } from '../enums/correspodent-type.enum'
import { Gender } from '../enums/gender.enum'
import { OrganizationType } from '../enums/organization-type.enum'
import { PersonType } from '../enums/person-type.enum'
import { SIRET_PATTERN } from '../models/person/person.model'
import { addressSchema } from './address.validator'
import { bankDetailsSchema } from './bank-details.validator'
import {
    basicSocialMediaSchema,
    djSocialMediaSchema,
} from './social-media.validator'

const basePersonSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    firstName: z.string().min(1, 'First name is required'),
    gender: z.nativeEnum(Gender, {
        required_error: 'Gender is required',
    }),
    address: addressSchema,
    email: z.string().email('Invalid email format').nullish(),
    phone: z.string().nullish(),
    socialMedia: basicSocialMediaSchema,
    profilePicture: z.string().url('Invalid profile picture URL').nullish(),
    description: z.string().nullish(),
    equipments: z.array(z.string()).nullish(),
})

export const memberSchema = basePersonSchema.extend({
    personType: z.literal(PersonType.MEMBER),
    organizationId: z
        .string()
        .min(1, 'Organization ID is required for members'),
    roles: z.array(z.nativeEnum(RoleType)),
    userId: z.string().nullish(),
})

export const djSchema = basePersonSchema.extend({
    personType: z.literal(PersonType.DJ),
    alias: z.string().min(1, 'Alias is required for DJs'),
    biography: z.string().nullish(),
    logo: z.string().url('Invalid logo URL').nullish(),
    eventIds: z.array(z.string()).nullish(),
    price: z.number().nonnegative('Price must be zero or positive'),
    agencyId: z.string().nullish(),
    bankDetails: bankDetailsSchema,
    siret: z
        .string()
        .regex(SIRET_PATTERN, 'SIRET must be exactly 14 digits')
        .nullish(),
    vat: z.string().nullish(),
    socialMedia: djSocialMediaSchema,
})

export const organizationSchema = basePersonSchema.extend({
    personType: z.literal(PersonType.ORGANIZATION),
    firstName: z.string().nullish(),
    gender: z.nativeEnum(Gender).nullish(),
    organizationType: z.nativeEnum(OrganizationType, {
        required_error: 'Organization type is required',
    }),
    correspondentIds: z.array(z.string()).nullish(),
    bankDetails: bankDetailsSchema,
    siret: z
        .string()
        .regex(SIRET_PATTERN, 'SIRET must be exactly 14 digits')
        .nullish(),
    vat: z.string().nullish(),
})

export const correspondentSchema = basePersonSchema.extend({
    personType: z.literal(PersonType.CORRESPONDENT),
    organizationId: z
        .string()
        .min(1, 'Organization ID is required for Correspondent'),
    correspondentType: z.nativeEnum(CorrespondentType, {
        required_error: 'Correspondent type is required',
    }),
    isActive: z.boolean(),
    isDefault: z.boolean(),
})

export const customerSchema = basePersonSchema.extend({
    personType: z.literal(PersonType.CUSTOMER),
    purchaseIds: z.array(z.string()).nullish(),
})

export const personSchema = z.discriminatedUnion('personType', [
    memberSchema,
    djSchema,
    organizationSchema,
    correspondentSchema,
    customerSchema,
])
