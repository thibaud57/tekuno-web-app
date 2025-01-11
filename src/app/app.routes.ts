import { Route } from '@angular/router'
import { initialDataResolver } from 'app/app.resolvers'
import { AuthGuard } from 'app/core/auth/guards/auth.guard'
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard'
import { LayoutComponent } from 'app/layout/layout.component'
import { TypeLayout } from './layout/layouts/enums/type-layout.enum'

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    {
        path: '',
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'home' },
            // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
            // path. Below is another redirection for that path to redirect the user to the desired
            // location. This is a small convenience to keep all main routes together here on this file.
            {
                path: 'signed-in-redirect',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },

            // Vitrine routes
            {
                path: '',
                component: LayoutComponent,
                children: [
                    {
                        path: 'home',
                        loadChildren: () =>
                            import('app/modules/vitrine/vitrine.routes').then(
                                m => m.default
                            ),
                    },
                ],
            },

            // Auth routes for guests
            {
                path: '',
                canActivate: [NoAuthGuard],
                canActivateChild: [NoAuthGuard],
                component: LayoutComponent,
                data: {
                    layout: TypeLayout.EMPTY,
                },
                loadChildren: () =>
                    import('app/modules/auth/auth.routes').then(
                        m => m.noAuthRoutes
                    ),
            },

            // Auth routes for authenticated users
            {
                path: '',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                component: LayoutComponent,
                data: {
                    layout: TypeLayout.EMPTY,
                },
                loadChildren: () =>
                    import('app/modules/auth/auth.routes').then(
                        m => m.authRoutes
                    ),
            },

            // Admin routes
            {
                path: '',
                canActivate: [AuthGuard],
                canActivateChild: [AuthGuard],
                component: LayoutComponent,
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('app/modules/admin/admin.routes').then(
                                m => m.default
                            ),
                    },
                ],
            },
        ],
    },
]
