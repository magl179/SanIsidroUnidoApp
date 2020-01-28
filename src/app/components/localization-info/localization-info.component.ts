import { Component, OnInit } from '@angular/core';
import { LocalizationService } from '../../services/localization.service';

@Component({
  selector: 'app-localization-info',
  templateUrl: './localization-info.component.html',
  styleUrls: ['./localization-info.component.scss'],
})
export class LocalizationInfoComponent implements OnInit {

  isGPSEnabled = true;
  constructor(private localizationService: LocalizationService) { }

  async ngOnInit() {
      await this.checkGPSEnable();
  }

  async checkGPSEnable(){
    const coords = await this.localizationService.checkGPSEnabled();
    // this.isGPSEnabled = (coords) ? true: false;        
    this.isGPSEnabled = false;        
}

}
