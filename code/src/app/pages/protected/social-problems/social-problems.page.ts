import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NavController, IonSegment } from '@ionic/angular';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { PostsService } from '../../../services/posts.service';
// import { IUserLogued } from 'src/app/interfaces/barrios';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs/operators';
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { environment } from '../../../../environments/environment';
import { NetworkService } from 'src/app/services/network.service';

@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems.page.html',
    styleUrls: ['./social-problems.page.scss'],
})
export class SocialProblemsPage implements OnInit {

    appNetworkConnection = false;
    subcategories = null;
    @ViewChild(IonSegment) segment: IonSegment;
    subcategory = '';
    // loading: any;
    // elements: any = [];
    // socialProblems: Observable<any>;
    AuthUser = null;

    socialProblems: ISocialProblem[] = [];
    socialProblemsLoaded = false;

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService,
        private userService: UserService,
        private networkService: NetworkService
    ) {
        console.log('Constructor Problemas Sociales');
    }

    async ngOnInit() {
        this.segment.value = 'all';
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        this.authService.getAuthUser().pipe(
            finalize(() => {
                this.socialProblemsLoaded = true;
            })
        ).subscribe(res => {
            this.AuthUser = res.user;
        },
        err => {
            console.log('Error al traer la informacion del usuario');   
            this.utilsService.showToast('No se pudieron cargar la información del usuario');
        });
        this.postService.getSubcategoriesByCategory(environment.socialProblemSlug).subscribe(res => {
            this.subcategories = res.data
        }, err => {
            console.log('Error al traer subcategorias', err);
            this.utilsService.showToast('No se pudo traer las subcategorias, intentalo más tarde');    
        })
    }
    //Codigo Asincrono
    ionViewWillEnter() {
        this.utilsService.enableMenu();
        this.loadSocialProblems();
    }

    reportSocialProblem() {
        this.navCtrl.navigateForward('/social-problem-create')
    }

    // ngOnDestroy() {
    //         console.log('Listado Problemas Sociales Destruido');
    //     this.resetSocialProblems();
    // }

    ionViewWillLeave() {
        console.log('IonWillLeave Listado Problemas Sociales Destruido');
        this.resetSocialProblems();
    }

    resetSocialProblems() {
        this.socialProblems = [];
        this.postService.resetSocialProblemsPage();
    }

    checkLikePost($details):boolean {
        if ($details && $details.length > 0) {
            const likes_user = this.utilsService.getUsersFromDetails($details);
            const user_made_like = this.utilsService.checkUserInDetails(this.AuthUser.id, likes_user);
            return user_made_like;
        }
        else {
            return false;
        }
    }

    toggleLike(like: boolean, id: number) {
        console.log((like) ? 'quitar like' : 'dar like');
        if (like) {
            this.postService.sendDeleteDetailToPost(id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.resetSocialProblems();
                this.loadSocialProblems();
            }, err => {
                    console.log('detalle no se pudo eliminar', err);
                    this.utilsService.showToast('No se pudo eliminar el like');
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id : id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                this.resetSocialProblems();
                this.loadSocialProblems();
            }, err => {
                    console.log('detalle no se pudo crear', err);
                    this.utilsService.showToast('No se pudo dar like');
            });
        }
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
            this.utilsService.showToast('No se pudieron cargar los problemas sociales');
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
        this.resetSocialProblems();
        this.navCtrl.navigateForward(`/social-problem-detail/${id}`);
    }

    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image:  this.getImages(post.images),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }

    getImages($imagesArray) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }

}
