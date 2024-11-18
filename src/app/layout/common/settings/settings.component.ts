import { Component, ViewEncapsulation } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { FuseDrawerComponent } from '@fuse/components/drawer'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: [
    `
      settings {
        position: static;
        display: block;
        flex: none;
        width: auto;
      }

      @media (screen and min-width: 1280px) {
        empty-layout + settings .settings-cog {
          right: 0 !important;
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatIconModule, FuseDrawerComponent],
})