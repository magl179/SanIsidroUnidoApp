import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from "../../../services/utils.service";
import { PostsService } from "../../../services/posts.service";
import { NetworkService } from "../../../services/network.service";
import { AuthService } from "../../../services/auth.service";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-emergency-detail',
  templateUrl: './emergency-detail.page.html',
  styleUrls: ['./emergency-detail.page.scss'],
})
export class EmergencyDetailPage implements OnInit {
    id: string;
    emergency = null;
    AuthUser = null;
    postLoaded = false;

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
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user; 
        });
        this.getEmergency();
    }

    getImageURL(image: string) {
        return this.utilsService.getImageURL(image);
    }
    
    getEmergency() {
        this.postService.getEmergency(+this.id).pipe(finalize(() => {
            this.postLoaded = true;
        })).subscribe((res: any) => {
            this.emergency = res.data;
            console.log('res post', res);
            console.log('Dato post', this.emergency);
        });
    }

}
