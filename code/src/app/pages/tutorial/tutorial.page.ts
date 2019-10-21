import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LocalDataService } from 'src/app/services/local-data.service';
import { ISlideTutorial } from 'src/app/interfaces/models';
import { UtilsService } from "src/app/services/utils.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.page.html',
    styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

    @ViewChild('tutorialSlider') tutorialSlider: any;
    smSlidesOpts: {
        loop: true
    };
    slides: ISlideTutorial[] = [];

    constructor(
        private navCtrl: NavController,
        public utilsService: UtilsService,
        private localDataService: LocalDataService) { }

    async ngOnInit() {
        this.localDataService.getTutoSlides().subscribe(
            (res: any) => {
                this.slides = res;
            }, (err: HttpErrorResponse) => {
                console.log('Error al traer las opciones del tutorial');
                this.utilsService.showToast({message: 'No se pudieron cargar las opciones del tutorial'});
            }
        );
        await this.utilsService.disabledMenu();
    }
    //Función cuando cambia el Slide para prevenir ir a la slide -1 y slide n+1
     slideChange(event) {
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
    slidesLoaded(event) {
        //console.dir(event);
        event.target.lockSwipeToPrev(true);
    }
    //Funcion navegar hacia pagina de Login
    goToLogin() {
        this.navCtrl.navigateForward('/login');
    }
    //Funcion para navegar a pagina de registro
    goToRegister() {
        this.navCtrl.navigateForward('/register');
    }
    //Obtener el Background
    getBackgroundApp(image_url: string) {
        return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
    }
}
