/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation'
import { NavigationType } from 'app/core/navigation/enums/typeNavigation.enum'

// Navigation verticale (admin uniquement, avec icônes)
export const verticalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/admin',
        meta: NavigationType.ADMIN,
    },
    {
        id: 'users',
        title: 'Utilisateurs',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/admin/users',
        meta: NavigationType.ADMIN,
    },
]

// Navigation horizontale pour tous les utilisateurs (sans icônes)
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Accueil',
        type: 'basic',
        link: '/',
        meta: NavigationType.VITRINE,
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: '/admin',
        meta: NavigationType.ADMIN,
    },
]
