import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { INotiList } from 'src/app/interfaces/models';
import { HttpRequestService } from './http-request.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {

  constructor(private notificationService: NotificationsService,
    private httpRequest: HttpRequestService) { }

  probarNotificacionesConDatos() {
   
  }

  probarNotificationExternaConDatos() {
   
  }

  switchSubscription() {
    this.notificationService.toggleOnesignalSubscription();
  }
}
