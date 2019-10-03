import { Component, OnInit, Input } from '@angular/core';
import { PostsService } from "src/app/services/posts.service";
import { environment } from "src/environments/environment";
import { UtilsService } from "src/app/services/utils.service";
import { FiltroSearchPipe } from "src/app/pipes/filtro-search.pipe";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: 'app-filter-posts',
  templateUrl: './filter-posts.component.html',
  styleUrls: ['./filter-posts.component.scss'],
})
export class FilterPostsComponent implements OnInit {

    @Input() posts = [];
    @Input() subcategory = '';
    subcategories = null;
    valorSegmento = 'all';
    // subcategory = '';
    

    constructor(
        private postService: PostsService,
        private utilsService: UtilsService,
        private popoverCtrl: PopoverController
  ) { }

    ngOnInit() { 

        this.postService.getSubcategoriesByCategory(environment.socialProblemSlug).subscribe(res => {
            this.subcategories = res.data
        }, err => {
            console.log('Error al traer subcategorias', err);
            this.utilsService.showToast('No se pudo traer las subcategorias, intentalo más tarde');
        });
        // console.log('subcategory', this.subcategory);
        // console.log('posts', this.posts);
    }

    radioButtonChanged(event) {

        const filtroSearchPipe = new FiltroSearchPipe();
        const valorFiltro = event.detail.value;
        // console.log(valorFiltro);
        if (valorFiltro === 'all') {
            this.subcategory = '';
            // console.log(this.subcategory);
            return;
        }
        this.subcategory = valorFiltro;
        // console.log('subcategory', this.subcategory);
        const newPosts = filtroSearchPipe.transform(this.posts, this.subcategory, 'subcategory_id');
        // console.log('new posts', newPosts);
        this.posts = newPosts;
        this.closeFiltroPopover();

    }

    closeFiltroPopover() {
        this.popoverCtrl.dismiss({
            'posts': this.posts,
            'subcategory': this.subcategory
        });
    }
    

}
