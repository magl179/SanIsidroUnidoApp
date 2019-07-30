import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonSegment } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
import { ISocialProblem, IUserLogued, IPostShare} from 'src/app/interfaces/barrios';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems.page.html',
    styleUrls: ['./social-problems.page.scss'],
})
export class SocialProblemsPage implements OnInit {

    @ViewChild(IonSegment) segment: IonSegment;
    subcategory = '';
    loading: any;
    elements: any = [];
    socialProblems: Observable<any>;
    currentUser: IUserLogued = null;

    socialProblemsList: ISocialProblem[] = [];

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService
    ) {
    }
    
    async ngOnInit() {
        this.segment.value = 'all';
        this.loading = await this.utilsService.createBasicLoading('Cargando Publicaciones');
        this.loading.present();
        this.currentUser = await this.authService.getCurrentUser();
        this.postService.getSocialProblems().subscribe(data => {
            if (data) {
                this.socialProblemsList = data;
            }
            this.loading.dismiss();
        });
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }

    segmentChanged(event) {
        const valorSegmento = event.detail.value;
        console.log(valorSegmento);
        if (valorSegmento === 'all') {
            this.subcategory = '';
            console.log(this.subcategory);
            return;
        }
        this.subcategory = valorSegmento;
        console.log(this.subcategory);
    }

    postDetail(id) {
        this.navCtrl.navigateForward(`/social-problem-detail/${id}`);
    }

    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image: 'no_image',
            url: ''

        };
        await this.utilsService.compartirRedSocial(sharePost);
    }

}
