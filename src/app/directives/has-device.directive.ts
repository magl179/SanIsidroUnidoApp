import { Directive, TemplateRef, ViewContainerRef, Input, OnChanges } from "@angular/core";

@Directive({
    selector: '[deviceUserIsRegister]'
})
export class DeviceUserIsRegisterDirective implements OnChanges {

    @Input('deviceUserIsRegister') user_devices = [];
    @Input() device = null;


    @Input('deviceUserIsRegisterDevice') set deviceUserIsRegisterDevice(device) {
        this.device = device;
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) { }

    ngOnChanges() {
        this.checkDeviceUser();
    }

    checkDeviceUser() {
        //Limpiar antes de verificar
        this.viewContainer.clear();
        //Si no tengo dispositivos muestro la opción de añadir
        if (this.user_devices.length == 0) {
            return this.viewContainer.createEmbeddedView(this.templateRef);
        }
        //Si tengo dispositivos
        if (this.user_devices.length > 0) {
            const deviceMatch = this.user_devices.filter(device => device.phone_id == this.device.phone_id);
            if(deviceMatch && deviceMatch.length > 0){
                return this.viewContainer.clear();
            }
            return this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            return this.viewContainer.clear();
        }
    }

}
