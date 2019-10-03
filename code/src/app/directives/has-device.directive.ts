import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from "@angular/core";
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Directive({
  selector: '[appHasDevice]'
})
export class HasDeviceDirective implements OnInit{

    @Input('appHasDevice') devices: any[] = [];

  constructor(
  	private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

    async ngOnInit() {
        // const hasDevice = await this.notificationService.hasDevices();
  	  if (this.devices.length > 0) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
  }

}
