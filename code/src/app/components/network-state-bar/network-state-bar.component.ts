import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'network-state-bar',
  templateUrl: './network-state-bar.component.html',
  styleUrls: ['./network-state-bar.component.scss'],
})
export class NetworkStateBarComponent implements OnInit {

    apphasConnection = false;
    constructor(
        private networkService: NetworkService
  ) { }

    async ngOnInit() {
        await this.networkService.testNetworkConnection();
        const isOnline = this.networkService.getNetworkTestValue();
        this.apphasConnection = isOnline;
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.apphasConnection = connected;
        });
  }

}
