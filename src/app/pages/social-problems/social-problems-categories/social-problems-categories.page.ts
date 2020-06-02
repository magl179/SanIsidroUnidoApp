import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PostsService } from "src/app/services/posts.service";
import { map, finalize } from 'rxjs/operators';
import { mapCategory } from 'src/app/helpers/utils';
import { ISubcategory, IRespuestaApiSIUSingle, IRespuestaApiSIU } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';

@Component({
  selector: 'app-social-problems-categories',
  templateUrl: './social-problems-categories.page.html',
  styleUrls: ['./social-problems-categories.page.scss'],
})
export class SocialProblemsCategoriesPage implements OnInit {

    categoriesLoaded = false;
    categories = [];
    
    constructor(private navCtrl: NavController,
        private postsService: PostsService) { }

    ngOnInit() {
        this.loadCategories()
  }
    
    goToList(slug_subcategory: string) {
        this.navCtrl.navigateForward(`/social-problems/list/${slug_subcategory}`);
    }

    loadCategories() {
        this.postsService.getSubcategoriesByCategory(CONFIG.SOCIAL_PROBLEMS_SLUG).pipe(
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
        ).subscribe((res : IRespuestaApiSIU) => {
            this.categories = res.data;
        });
    }

    

}
