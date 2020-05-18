import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PostsService } from "src/app/services/posts.service";
import { map, finalize } from 'rxjs/operators';
import { mapCategory } from 'src/app/helpers/utils';
import { ISubcategory, IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';

@Component({
  selector: 'app-events-problems-categories',
  templateUrl: './events-categories.page.html',
  styleUrls: ['./events-categories.page.scss'],
})
export class EventsCategoriesPage implements OnInit {

    categoriesLoaded = false;
    categories = [];
    
    constructor(private navCtrl: NavController,
        private postsService: PostsService) { }

    ngOnInit() {
        this.loadCategories()
  }
    
    goToList(slug_subcategory: string) {
        this.navCtrl.navigateForward(`/events/list/${slug_subcategory}`);
    }

    loadCategories() {
        this.postsService.getSubcategoriesByCategory(CONFIG.EVENTS_SLUG).pipe(
            map((res: IRespuestaApiSIUSingle) => {
                if (res && res.data) {
                    res.data.forEach((category: ISubcategory) => {
                        category = mapCategory(category);
                    });
                }
                return res;
            }),
            finalize(() => {
                this.categoriesLoaded = true;
            })
        ).subscribe((res : any) => {
            this.categories = res.data;
        });
    }

    

}
