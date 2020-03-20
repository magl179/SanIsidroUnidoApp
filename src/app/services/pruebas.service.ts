import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { INotiList } from '../interfaces/models';
import { HttpRequestService } from './http-request.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {

  constructor(private notificationService: NotificationsService,
    private httpRequest: HttpRequestService) { }

  probarNotificacionesConDatos() {
    const noti: INotiList = {
      title: 'post title0',
      message: 'post description',
      notification_user: {
        email: 'jose@gmail.com',
        id: 5,
        first_name: 'jose',
        last_name: 'maza',
        state: 1 
      },
      post: {
        id: 15,
        title: 'post title0',
        description: 'description',
        category_id: 1,
        state: 1,
        date: '12-02-2020',
        time: '20:00:25',
        additional_data: null,
        user_id: 5,
        imagesArr: [],
        is_attended: 0,
        subcategory_id: 1,
        subcategory: {
          id: 1,
          name: 'Seguridad',
          description: 'Seguridad',
          category_id: 4,
          slug: 'seguridad'
        },
        category: {
          id: 1,
          name: 'Problema Social',
          description: 'problema_social',
          slug: 'problema_social'
        },
      }
    };
    this.notificationService.managePostNotification(noti.post);
  }

  probarNotificationExternaConDatos() {
    const peticion = this.httpRequest.get(`${environment.APIBASEURL}/guzzle-noti`);
    peticion.subscribe(res => {
      alert('peticion realizada correctamente')
    }, err => {
      alert('peticion realizada incorrectamente')
    });
  }

  switchSubscription() {
    this.notificationService.toggleOnesignalSubscription();
  }
}
