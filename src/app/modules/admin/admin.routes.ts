import { Routes } from '@angular/router'
import { DashboardComponent } from 'app/modules/admin/dashboard/dashboard.component'
import { AddressBookComponent } from './address-book/address-book.component'
import { EventsComponent } from './events/events.component'
import { InvoicesComponent } from './invoices/invoices.component'
import { MailboxComponent } from './mailbox/mailbox.component'
import { VaultComponent } from './vault/vault.component'

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'address-book',
        component: AddressBookComponent,
    },
    {
        path: 'mailbox',
        component: MailboxComponent,
    },
    {
        path: 'events',
        component: EventsComponent,
    },
    {
        path: 'invoices',
        component: InvoicesComponent,
    },
    {
        path: 'vault',
        component: VaultComponent,
    },
] as Routes
