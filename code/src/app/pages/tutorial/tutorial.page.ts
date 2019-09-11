import { Component, OnInit, ViewChild } from '@angular/core';
import { timer } from 'rxjs';
import { MenuController, NavController } from '@ionic/angular';
import { LocalDataService } from 'src/app/services/local-data.service';
import { ISlideTutorial } from 'src/app/interfaces/models';
import { UtilsService } from "../../services/utils.service";

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
        private menuCtrl: MenuController,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private localDataService: LocalDataService) { }

    async ngOnInit() {
        this.localDataService.getTutoSlides().subscribe(
            res => {
                //console.log('slides', res);
                this.slides = res;
            }, err => {
                console.log('Error al traer las opciones del tutorial');
                this.utilsService.showToast('No se pudieron cargar las opciones del tutorial');
            }
        );
        await this.utilsService.disabledMenu();
    }



    closeMenu() {
        this.menuCtrl.close();
    }

    async startTutorial() {
        await this.closeMenu();
        timer(300).subscribe(() => {
            this.navCtrl.navigateRoot('/home');
        });
    }

    getBackgroundG(image_url) {
        return `linear-gradient(rgba(2, 2, 2, 0.58), rgba(2, 2, 2, 0.58)), url(${image_url})`;
    }

    slideChange(event) {
        // console.log('evento change end', event)


        // const isBeginningSlide = event.target.isBeginning();
        // const isEndSlideBeginning = event.target.isEnd();

        event.target.isBeginning().then(is_first_slide => {
            // console.log('is begin slide', is_first_slide);
            // console.log('is last slide', is_last_slide);
            if (is_first_slide) {
                event.target.lockSwipeToPrev(true);
            } else {
                event.target.lockSwipeToPrev(false);
            }
        });
        event.target.isEnd().then(is_last_slide => {
            // console.log('is last slide', is_last_slide);
            if (is_last_slide) {
                event.target.lockSwipeToNext(true);
            } else {
                event.target.lockSwipeToNext(false);
            }
        });
    }


    slidesLoaded(event) {
        // console.log('slides load', event);
        //Bloquear Slide Prev al cargar slides
        event.target.lockSwipeToPrev(true);
    }
    // slideNextEnd(event) {
    //     console.log('evento next end', event)
    //     console.log('evento next end index', event.target.getActiveIndex())
    // }

    async goToLogin() {
        // await this.closeMenu();
        // timer(300).subscribe(() => {
        //     this.navCtrl.navigateRoot('/login');
        // });
        this.navCtrl.navigateForward('/login');
    }

    async goToRegister() {
        // await this.closeMenu();
        // timer(300).subscribe(() => {
        //     this.navCtrl.navigateRoot('/register');
        // });
        this.navCtrl.navigateForward('/register');
    }



}
