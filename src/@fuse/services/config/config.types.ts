import { TypeLayout } from 'app/layout/layouts/enums/type-layout.enum'
import { TypeScheme } from 'app/layout/layouts/enums/type-scheme.enum'

// Types
export type Scheme = TypeScheme
export type Screens = Record<string, string>
export type Theme = 'theme-default' | string
export type Themes = { id: string; name: string }[]

/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface FuseConfig {
    layout: TypeLayout
    scheme: Scheme
    screens: Screens
    theme: Theme
    themes: Themes
}
