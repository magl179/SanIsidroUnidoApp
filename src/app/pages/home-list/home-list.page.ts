import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { LocalDataService } from 'src/app/services/local-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { IHomeOptions } from 'src/app/interfaces/models';
import { NavController, ModalController } from '@ionic/angular';
import { PruebasService } from 'src/app/services/pruebas.service';
import { environment } from 'src/environments/environment';
import { RequestMembershipPage } from 'src/app/modals/request-membership/request-membership.page';

@Component({
    selector: 'app-home-list',
    templateUrl: 'home-list.page.html',
    styleUrls: ['home-list.page.scss'],
})
export class HomeListPage implements OnInit {

    servicesList: IHomeOptions[] = [];
    sessionAuth = null;
    production = environment.production;

    constructor(
        private utilsService: UtilsService,
        private navCtrl: NavController,
        private localDataService: LocalDataService,
        private authService: AuthService,
        private pruebasService: PruebasService,
        private modalCtrl: ModalController
    ) {
     }

    async ngOnInit() {
        this.authService.sessionAuthUser.subscribe((token_decoded: any) => {
            if (token_decoded) {
                this.sessionAuth = token_decoded;
            }
        });
        this.localDataService.getHomeOptions()
        .subscribe((data: IHomeOptions[]) => {
            this.servicesList = data;
        });
        await this.utilsService.enableMenu();
    }
    
    navigate(urlOrFuncionName: string) {
        return this.navCtrl.navigateForward(urlOrFuncionName);

    }

    probarNotiLocal(){
        this.pruebasService.probarNotificacionesConDatos();
    }
    probarNotiExterna(){
        this.pruebasService.probarNotificationExternaConDatos();
    }

    probarNotiEmergencia(){
        this.navCtrl.navigateForward('/emergencies/detail/8');
    }

    probarToggleSubscription(){
        this.pruebasService.switchSubscription();
    }

    async openRequestAfiliationModal(){
        const modal = await this.modalCtrl.create({
            component: RequestMembershipPage,
            componentProps: {
                nombre: 'Stalin',
                pais: 'Ecuador'
            }
        });
        await modal.present();
    }
    

}
