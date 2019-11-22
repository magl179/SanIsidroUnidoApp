import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PublicService } from 'src/app/services/public.service';
import { finalize } from 'rxjs/operators';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-public-services-categories',
  templateUrl: './public-services-categories.page.html',
  styleUrls: ['./public-services-categories.page.scss'],
})
export class PublicServicesCategoriesPage implements OnInit {

    publicServiceCategories: any[] = [];
    categoriesLoaded = false;
    constructor(private navCtrl: NavController,
        private publicService: PublicService) { }

    ngOnInit() {
        this.loadCategories();
  }
    
    goToList(category: string) {
        console.log('navegar ps')
        let navigationExtras: NavigationExtras = {
            state: { category }
          };
      this.navCtrl.navigateForward(`/public-services/${category}`, navigationExtras)
    }
    
    loadCategories() {
        this.categoriesLoaded = false;
        this.publicService.getPublicServiceCategories().pipe(finalize(() =>{
            this.categoriesLoaded = true;
        })).subscribe(res => {
            this.publicServiceCategories = res.data;
            console.log(this.publicServiceCategories)
        });
    }

}
