import { Routes } from '@angular/router'
import { AuthGuard } from 'app/core/auth/guards/auth.guard'
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'
import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { AuthResetPasswordComponent } from './reset-password/reset-password.component'
import { AuthSignInComponent } from './sign-in/sign-in.component'
import { AuthSignOutComponent } from './sign-out/sign-out.component'
import { AuthUnlockSessionComponent } from './unlock-session/unlock-session.component'

export const authRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: 'sign-out', component: AuthSignOutComponent },
            { path: 'unlock-session', component: AuthUnlockSessionComponent },
        ],
    },
]

export const noAuthRoutes: Routes = [
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        children: [
            { path: 'sign-in', component: AuthSignInComponent },
            { path: 'forgot-password', component: AuthForgotPasswordComponent },
            { path: 'reset-password', component: AuthResetPasswordComponent },
        ],
    },
]
