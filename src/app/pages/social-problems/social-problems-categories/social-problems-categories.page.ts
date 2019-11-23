import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PostsService } from "src/app/services/posts.service";
import { environment } from "src/environments/environment";
import { map, finalize } from 'rxjs/operators';
import { mapCategory } from 'src/app/helpers/utils';
import { ISubcategory, IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { NavigationExtras } from '@angular/router';
import { LocalDataService } from 'src/app/services/local-data.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-social-problems-categories',
  templateUrl: './social-problems-categories.page.html',
  styleUrls: ['./social-problems-categories.page.scss'],
})
export class SocialProblemsCategoriesPage implements OnInit {

    categoriesLoaded = false;
    categories = [];
    
    constructor(private navCtrl: NavController,
        private postsService: PostsService,
    private navigationService: NavigationService) { }

    ngOnInit() {
        this.loadCategories()
  }
    
    goToList(slug_subcategory: string) {
        this.navCtrl.navigateForward(`/social-problems/list/${slug_subcategory}`);
    }

    loadCategories() {
        this.postsService.getSubcategoriesByCategory(environment.socialProblemSlug).pipe(
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
            console.log(res.data);
            this.categories = res.data;
        });
    }

    

}
