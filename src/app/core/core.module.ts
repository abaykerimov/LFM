import { NgModule } from '@angular/core';
import { LaravelEchoService } from './laravel-echo.service';
import {NotificationService} from "./notification.service";
import {UserService} from "./user.service";

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
        UserService,
    ]
})
export class CoreModule {
}
