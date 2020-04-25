import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PublicService } from 'src/app/services/public.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'siu-public-services-app',
    templateUrl: './public-services-app.page.html',
    styleUrls: ['./public-services-app.page.scss'],
})
export class PublicServicesAppPage implements OnInit {

    publicServiceCategories: any[] = [];
    categoriesLoaded = false;
    isGPSEnabled = false;

    constructor(private navCtrl: NavController,
        private publicService: PublicService,) { }

    async ngOnInit() {
        this.loadCategories();
        
    }

    goToList(category: string) {
        this.navCtrl.navigateForward(`/public-services/list/${category}`);
    }

    loadCategories() {
        this.categoriesLoaded = false;
        this.publicService.getPublicServiceCategories().pipe(finalize(() => {
            this.categoriesLoaded = true;
        })).subscribe(res => {
            this.publicServiceCategories = res.data;
        });
    }

}
