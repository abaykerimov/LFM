/**
 * Created by Абай on 12.10.2017.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  constructor() {}

  public sendNotification(title, options, auction_id) {
    // if (!("Notification" in window)) {
    //   alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
    // }

    Notification.requestPermission(permission => {
      if (permission === "granted") {
        let notification = new Notification(title, options);
        notification.onclick = () => {
          window.location.href = '/auctions/detail/' + auction_id
        };
      } else {
        alert('Вы запретили показывать уведомления');
      }
    });
  }
}

