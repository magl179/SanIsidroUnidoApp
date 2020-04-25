import { Directive, OnInit, TemplateRef, ViewContainerRef, Input } from "@angular/core";

@Directive({
  selector: '[appHasDevice]'
})
export class HasDeviceDirective implements OnInit{

    @Input('appHasDevice') devices: any[] = [];

  constructor(
  	private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

    async ngOnInit() {
  	  if (this.devices.length > 0) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
  }

}
