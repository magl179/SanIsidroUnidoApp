import { Component, OnInit } from '@angular/core';
import { NavController } from "@ionic/angular";
import { PostsService } from "src/app/services/posts.service";
import { map, finalize } from 'rxjs/operators';
import { mapCategory } from 'src/app/helpers/utils';
import { ISubcategory, IRespuestaApiSIUSingle, IRespuestaApiSIU } from "src/app/interfaces/models";
import { CONFIG } from 'src/config/config';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-emergencies-categories',
    templateUrl: './emergencies-categories.page.html',
    styleUrls: ['./emergencies-categories.page.scss'],
})
export class EmergenciesCategoriesPage implements OnInit {

    categoriesLoaded = false;
    categories = [
        { title: 'Todas', value: 'all', icon: 'assets/img/svg/list.svg' },
    ];
    isPolicia = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    async ngOnInit() {
        //Verificar si es policia
        this.isPolicia = await this.authService.userHasRole(['Policia']);
        if(!this.isPolicia){
            this.categories.push({ title: 'Mis Emergencias', value: 'mias', icon: 'assets/img/svg/files-and-folders.svg' });
        }
    }

    goToList(value: string) {
        this.router.navigate(['/emergencies/list'], { queryParams: { all: value } });
    }



}
