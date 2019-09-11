import { Directive, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Directive({
  selector: '[appHasDevice]'
})
export class HasDeviceDirective implements OnInit{

  constructor(
  	private authService: AuthService,
  	private notificationService: NotificationsService,
  	private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

    async ngOnInit() {
        const hasDevice = await this.notificationService.hasDevices();
  	  if (hasDevice) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
  }

}
