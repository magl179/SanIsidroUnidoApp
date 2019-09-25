import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from "../../../services/utils.service";
import { PostsService } from "../../../services/posts.service";
import { NetworkService } from "../../../services/network.service";
import { AuthService } from "../../../services/auth.service";
import { finalize } from 'rxjs/operators';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';

@Component({
  selector: 'app-emergency-detail',
  templateUrl: './emergency-detail.page.html',
  styleUrls: ['./emergency-detail.page.scss'],
})
export class EmergencyDetailPage implements OnInit {
    id: string;
    emergency = null;
    emergencyLoaded = false;
    AuthUser = null;
    // postLoaded = false;

  constructor(  private route: ActivatedRoute,
    public utilsService: UtilsService,
      private postService: PostsService,
    private modalCtrl: ModalController,
    private networkService: NetworkService,
    private authService: AuthService) { }

    ngOnInit() {
      
        this.id = this.route.snapshot.paramMap.get('id');
        console.log('ID RECIBIDO:', this.id);
        // this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
        //     this.appNetworkConnection = connected;
        // });
        this.authService.getAuthUser().subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user; 
            }
        });
        this.getEmergency();
    }

    getImageURL(image: string) {
        return this.utilsService.getImageURL(image);
    }
    
    getEmergency() {
        this.emergencyLoaded = false;
        this.postService.getEmergency(+this.id).pipe(finalize(() => {
            this.emergencyLoaded = true;
        })).subscribe((res: IRespuestaApiSIUSingle) => {
            this.emergency = res.data;
            console.log('Dato post', this.emergency);
        });
    }

    getBGCover(image_cover: any) {
        const img = this.utilsService.getImageURL(image_cover);
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${img}')`;
}

    async showImageDetailModal(image: string) {
        const modal = await this.modalCtrl.create({
            component: ImageDetailPage,
            componentProps: {
                image,
            }
        });
        await modal.present();
    }

}
