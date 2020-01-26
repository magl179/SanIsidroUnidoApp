import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { INotiPostOpen } from '../interfaces/models';
import { HttpRequestService } from './http-request.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {

  constructor(private notificationService: NotificationsService,
     private httpRequest: HttpRequestService) { }

  probarNotificacionesConDatos(){
      const post: INotiPostOpen = {
        category: 'emergencias',
        id: 15
      };
      this.notificationService.managePostNotification(post);
  }

  probarNotificationExternaConDatos(){
      const peticion = this.httpRequest.get(`${environment.APIBASEURL}/guzzle-noti`);
      peticion.subscribe(res=>{
          console.log('res test', res)
        alert('peticion realizada correctamente')
    }, err=>{
        alert('peticion realizada incorrectamente')
        console.log('res err', err)
      });
  }
  
  switchSubscription(){
    this.notificationService.toggleOnesignalSubscription();
  }
}
