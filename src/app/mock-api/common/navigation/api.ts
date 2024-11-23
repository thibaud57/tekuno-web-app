import { Injectable } from '@angular/core'
import { FuseMockApiService } from '@fuse/lib/mock-api'
import {
    horizontalNavigation,
    verticalNavigation,
} from 'app/mock-api/common/navigation/data'
import { cloneDeep } from 'lodash-es'

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers()
    }

    registerHandlers(): void {
        this._fuseMockApiService.onGet('api/common/navigation').reply(() => [
            200,
            {
                compact: cloneDeep(verticalNavigation),
                vertical: cloneDeep(verticalNavigation),
                horizontal: cloneDeep(horizontalNavigation),
            },
        ])
    }
}
