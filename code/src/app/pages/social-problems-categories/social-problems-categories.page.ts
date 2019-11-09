import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PostsService } from "../../services/posts.service";
import { environment } from "../../../environments/environment";
import { map, finalize } from 'rxjs/operators';
import { mapCategory } from 'src/app/helpers/utils';
import { ISubcategory, IRespuestaApiSIUSingle } from "src/app/interfaces/models";

@Component({
  selector: 'app-social-problems-categories',
  templateUrl: './social-problems-categories.page.html',
  styleUrls: ['./social-problems-categories.page.scss'],
})
export class SocialProblemsCategoriesPage implements OnInit {

    categoriesLoaded = false;

    items = [
        { title: 'Protección Animal', image: 'http://localhost/resources/svg/chat.svg', color: 'primary' },
        { title: 'Seguridad',  image: 'http://localhost/resources/svg/envelope.svg',color: 'secondary' },
        { title: 'Espacios Verdes',  image: 'http://localhost/resources/svg/headset.svg',color: 'tertiary' },
        { title: 'Transporte Y Tránsito',  image: 'http://localhost/resources/svg/imac.svg',color: 'warning' },
    ];
    categories = [];
    
    constructor(private navCtrl: NavController,
    private postsService: PostsService) { }

    ngOnInit() {
        this.loadCategories()
  }
    
    goToList(slug_subcategory: string) {
        this.navCtrl.navigateForward(`/social-problems-tabs/list/${slug_subcategory}`);
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
