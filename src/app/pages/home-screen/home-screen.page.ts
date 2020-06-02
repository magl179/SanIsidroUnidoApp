import { Component, OnInit, } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalDataService } from 'src/app/services/local-data.service';
import { ISlideTutorial, ICustomEvent } from 'src/app/interfaces/models';
import { UtilsService } from "src/app/services/utils.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorService } from 'src/app/services/error.service';

@Component({
    selector: 'app-home-screen',
    templateUrl: './home-screen.page.html',
    styleUrls: ['./home-screen.page.scss'],
})
export class HomeScreenPage implements OnInit {

    smSlidesOpts: {
        loop: true
    };
    slides: ISlideTutorial[] = [];
    isPolicia = false;

    constructor(
        private navCtrl: NavController,
        private errorService: ErrorService,
        public utilsService: UtilsService,
        private localDataService: LocalDataService) { }

    async ngOnInit() {
        this.localDataService.getTutoSlides().subscribe(
            (res: ISlideTutorial[]) => {
                this.slides = res;
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'No se pudieron cargar las opciones del tutorial');
            }
        );
        await this.utilsService.disabledMenu();
    }
    
     slideChange(event: ICustomEvent ) {
        event.target.isBeginning().then(is_first_slide => {
            if (is_first_slide) {
                event.target.lockSwipeToPrev(true);
            } else {
                event.target.lockSwipeToPrev(false);
            }
        });
        event.target.isEnd().then(is_last_slide => {
            if (is_last_slide) {
                event.target.lockSwipeToNext(true);
            } else {
                event.target.lockSwipeToNext(false);
            }
        });
     }
    // Funcion cuando el slide carga
    slidesLoaded(event: ICustomEvent) {
        event.target.lockSwipeToPrev(true);
    }
    //Funcion navegar hacia pagina de Login
    goToLogin() {
        this.navCtrl.navigateForward('/login');
    }
    //Funcion para navegar a pagina de registro
    goToRegister() {
        this.navCtrl.navigateForward('/register', {animated: true});
    }
    goToHome(){
        this.navCtrl.navigateRoot('/home-list')
    }     
    //Obtener el Background
    getBackgroundApp(image_url: string) {
        return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
    }
}
