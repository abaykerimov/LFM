import { NgModule } from '@angular/core';
import { LaravelEchoService } from './laravel-echo.service';
import {NotificationService} from "./notification.service";

@NgModule({
    imports: [
    ],
    exports: [
    ],
    declarations: [
    ],
    providers: [
        LaravelEchoService,
        NotificationService,
    ]
})
export class CoreModule {
}
