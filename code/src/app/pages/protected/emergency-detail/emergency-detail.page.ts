import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from "../../../services/utils.service";
import { PostsService } from "../../../services/posts.service";
import { NetworkService } from "../../../services/network.service";
import { AuthService } from "../../../services/auth.service";
import { finalize } from 'rxjs/operators';
import { IRespuestaApiSIUSingle } from 'src/app/interfaces/models';

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

}
