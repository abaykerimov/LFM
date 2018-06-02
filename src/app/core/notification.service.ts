/**
 * Created by Абай on 12.10.2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor() {}

  public sendNotification(title, options, link) {
    // if (!("Notification" in window)) {
    //   alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    // }

    Notification.requestPermission(permission => {
      console.log(permission);

      if (permission === "granted") {
        let notification = new Notification(title, options);
        notification.onclick = () => {
          window.location.href = link
        };
      } else {
        Notification.requestPermission();
      }
    });
  }
}

