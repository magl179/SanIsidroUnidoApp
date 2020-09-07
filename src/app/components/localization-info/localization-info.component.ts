import { Component, OnInit, Input } from '@angular/core';
import { LocalizationService } from 'src/app/services/localization.service';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-localization-info',
    templateUrl: './localization-info.component.html',
    styleUrls: ['./localization-info.component.scss'],
})
export class LocalizationInfoComponent implements OnInit {

    @Input() gpsTextInfo = 'Para poder listar correctamente los servicios públicos, por favor enciende tu GPS';
    isGPSEnabled = true;
    constructor(
        private localizationService: LocalizationService,
        private platform: Platform
    ) { }

    async ngOnInit() {
        await this.checkGPSEnable();
    }

    async checkGPSEnable() {
        const coords = await this.localizationService.checkGPSEnabled();
        this.isGPSEnabled = (coords) ? true : false;
    }

    openSwitchLocation() {
        if (this.platform.is('cordova')) {
            this.localizationService.openLocalizationSettings();
            this.isGPSEnabled = true;
        }
    }

}
