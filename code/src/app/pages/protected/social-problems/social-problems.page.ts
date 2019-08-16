import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, IonSegment } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
import { ISocialProblem, IUserLogued, IPostShare } from 'src/app/interfaces/barrios';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems.page.html',
    styleUrls: ['./social-problems.page.scss'],
})
export class SocialProblemsPage implements OnInit, OnDestroy {

    subcategorias = [
        { title: 'Transporte&Tránsito', slug: 'transport_transit' },
        { title: 'Seguridad', slug: 'security' },
        { title: 'EspaciosVerdes', slug: 'green_areas' },
        { title: 'Transporte&Tránsito', slug: 'transport_transit' }
    ];
    @ViewChild(IonSegment) segment: IonSegment;
    subcategory = '';
    loading: any;
    elements: any = [];
    // socialProblems: Observable<any>;
    AuthUser: IUserLogued = null;

    socialProblems: ISocialProblem[] = [];

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService,
        private userService: UserService
    ) {
    }

    async ngOnInit() {
        this.segment.value = 'all';
        this.authService.getAuthUser().subscribe(user => {
            this.AuthUser = user;
        });
        // this.AuthUser = await this.authService.getCurrentUser();
        this.loadSocialProblems();
    }

    ngOnDestroy(){
        this.postService.resetSocialProblemsPage();
    }

    ionViewWillEnter() {
        this.utilsService.enableMenu();
    }

    loadSocialProblems(event?) {
        this.postService.getSocialProblems().subscribe(res => {
            const socialProblems = res.social_problems;
            if (socialProblems) {
                console.log('data', res);
                if (socialProblems.data.length === 0) {
                    if (event) {
                        event.target.disabled = true;
                        event.target.complete();
                    }
                    return;
                }
                this.socialProblems.push(...socialProblems.data);
                if (event) {
                    event.target.complete();
                }
            }
        },
        err => {
            console.log(err);
        });
    }

    getInfiniteScrollData(event) {
        this.loadSocialProblems(event);
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
