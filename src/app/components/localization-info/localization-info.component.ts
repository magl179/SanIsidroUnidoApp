import { Component, OnInit, Input } from '@angular/core';
import { LocalizationService } from '../../services/localization.service';

@Component({
    selector: 'app-localization-info',
    templateUrl: './localization-info.component.html',
    styleUrls: ['./localization-info.component.scss'],
})
export class LocalizationInfoComponent implements OnInit {

    @Input() gpsTextInfo = 'Para poder listar correctamente los servicios públicos, por favor enciende tu GPS';
    isGPSEnabled = true;
    constructor(private localizationService: LocalizationService) { }

    async ngOnInit() {
        await this.checkGPSEnable();
    }

    async checkGPSEnable() {
        const coords = await this.localizationService.checkGPSEnabled();
        this.isGPSEnabled = (coords) ? true : false;
        // this.isGPSEnabled = false;        
    }

    openSwitchLocation(){
        this.localizationService.openLocalizationSettings();
        setTimeout(async()=>{
            // await this.checkGPSEnable();
            this.isGPSEnabled = true;
        }, 1000);
    }

}
