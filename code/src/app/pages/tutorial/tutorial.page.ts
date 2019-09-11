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

}
