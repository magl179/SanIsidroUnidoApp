import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { INotiPostOpen } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {

  constructor(private notificationService: NotificationsService) { }

  probarNotificacionesConDatos(){
      const post: INotiPostOpen = {
        category: 'emergencias',
        id: 15
      };
      this.notificationService.managePostNotification(post);
  }
}
