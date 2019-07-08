import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MenuManagedService } from 'src/app/services/menu-managed.service';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';


@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems.page.html',
    styleUrls: ['./social-problems.page.scss'],
})
export class SocialProblemsPage implements OnInit {

    loading: any;
    elements: any = [];

    constructor(
        private navCtrl: NavController,
        private menuManagedService: MenuManagedService,
        private utilsService: UtilsService,
        private authService: AuthService
    ) {

    }



    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Problemas');
        this.loading.present();
        setTimeout(() => {
            this.elements = [1, 1, 1];
            this.loading.dismiss();
            this.authService.user.subscribe(user => {
                if (user) {
                    console.log('Usuario Logueado', user);
                } else {
                    console.log('Usuario no Logueado');
                }
            });
        }, 3000);
    }

    ionViewWillEnter() {
        this.menuManagedService.activarMenu();
    }

    postDetail(id) {
        // this.navCtrl.navigateRoot('/social-problem-detail', id);
        // this.navCtrl.navigateRoot(`/social-problem-detail/${id}`);
        this.navCtrl.navigateForward(`/social-problem-detail/${id}`);
    }

}
