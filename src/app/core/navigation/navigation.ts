import { FuseNavigationItem } from '@fuse/components/navigation'

export interface Navigation {
    admin: FuseNavigationItem[]
    vitrine: FuseNavigationItem[]
}

export const adminNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'modules.admin.dashboard.tableau-de-bord',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
    },
    {
        id: 'address-book',
        title: 'modules.admin.address-book.carnet-adresses',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/address-book',
    },
    {
        id: 'mailbox',
        title: 'modules.admin.mailbox.boite-mail',
        type: 'basic',
        icon: 'heroicons_outline:envelope',
        link: '/mailbox',
    },
    {
        id: 'events',
        title: 'modules.admin.events.evenements',
        type: 'basic',
        icon: 'heroicons_outline:calendar',
        link: '/events',
    },
    {
        id: 'invoices',
        title: 'modules.admin.invoices.factures',
        type: 'basic',
        icon: 'heroicons_outline:document-text',
        link: '/invoices',
    },
    {
        id: 'files',
        title: 'modules.admin.files.fichiers',
        type: 'basic',
        icon: 'heroicons_outline:folder',
        link: '/files',
    },
]

export const vitrineNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'modules.vitrine.home.accueil',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/',
    },
]
