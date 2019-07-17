import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
import { ISocialProblem, IUserLogued} from 'src/app/interfaces/barrios';

@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems.page.html',
    styleUrls: ['./social-problems.page.scss'],
})
export class SocialProblemsPage implements OnInit {

    loading: any;
    elements: any = [];
    currentUser: IUserLogued = null;

    socialProblemsList: ISocialProblem[];

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService
    ) {

    }

    async ngOnInit() {
        this.loading = await this.utilsService.createBasicLoading('Cargando Publicaciones');
        this.loading.present();
        this.currentUser = await this.authService.getCurrentUser();
        this.postService.getSocialProblems().subscribe(data => {
            if (data) {
                this.socialProblemsList = data;
            }
            this.loading.dismiss();
        });
        // setTimeout(() => {
        //     this.elements = [1, 1, 1];
        // }, 1500);
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }

    postDetail(id) {
        this.navCtrl.navigateForward(`/social-problem-detail/${id}`);
    }

}
