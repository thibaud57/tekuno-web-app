/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation'

// Todo TEK-23: title indiquer la key qui sera utilisé dans le fichier de traduction
// Compléter le fichier de traduction
export const adminNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/',
    },
    {
        id: 'users',
        title: 'Utilisateurs',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/',
    },
]

export const vitrineNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Accueil',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/',
    },
    {
        id: 'page',
        title: 'Page',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/',
    },
]
