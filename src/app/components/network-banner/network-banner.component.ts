import { Component, OnInit, Input } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-network-banner',
  templateUrl: './network-banner.component.html',
  styleUrls: ['./network-banner.component.scss'],
})
export class NetworkBannerComponent implements OnInit {
    constructor(
      private networkService: NetworkService
  ) { }

    ngOnInit() {
  }

}
