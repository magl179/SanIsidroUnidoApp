import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ISocialProblem } from 'src/app/interfaces/barrios';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from '../../../services/posts.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { IPostShare, ISocialProblem, IRespuestaApiSIUSingle } from "../../../interfaces/models";
import { NetworkService } from 'src/app/services/network.service';
import { environment } from "../../../../environments/environment";
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { finalize } from 'rxjs/operators';




@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    // postLiked = false;
    // test = false;
    id: string;
    // idPost: number;
    socialProblem: ISocialProblem = null;
    socialProblemLoaded = false;
    AuthUser = null;
    appNetworkConnection = false;

    constructor(
        private route: ActivatedRoute,
        private postService: PostsService,
        public utilsService: UtilsService,
        private modalCtrl: ModalController,
        private networkService: NetworkService,
        private authService: AuthService) { }

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        
        this.authService.getAuthUser().subscribe(res => {
            this.AuthUser = res.user;
        },
        err => {
            console.log('Error al traer los problemas sociales');    
        });
        this.getSocialProblem();
    }
    //Obtener el detalle de un problema social
    getSocialProblem() {
        this.socialProblemLoaded = false;
        this.postService.getSocialProblem(+this.id).pipe(
            finalize(() => {
                this.socialProblemLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            if (res.data) {
                this.socialProblem = res.data;
                this.socialProblem.postLiked = this.utilsService.checkLikePost(this.socialProblem.details, this.AuthUser);
                this.socialProblem.user.avatar = (this.socialProblem.user && this.socialProblem.user.avatar) ? this.utilsService.getImageURL(this.socialProblem.user.avatar) : null;
                if (this.socialProblem.images && this.socialProblem.images.length > 0) {
                    this.socialProblem.images.forEach((image: any) => {
                        image.url = (image.url) ? this.utilsService.getImageURL(image.url) : null;
                    });
                }
                console.log('social problem detail', res)
                console.log('social problem detail', this.socialProblem)
            }
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

    //Verificar Like de un Post
    // checkLikePost($details) {
    //     if ($details && $details.length > 0) {
    //         const likes_user = this.utilsService.getUsersFromDetails($details);
    //         const user_made_like = this.utilsService.checkUserInDetails(this.AuthUser.id, likes_user);
    //         return user_made_like;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    toggleLike(like: boolean) {
        console.log((like) ? 'quitar like' : 'dar like');
        if (like) {
            this.postService.sendDeleteDetailToPost(this.socialProblem.id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                // this.getSocialProblem();
                this.socialProblem.postLiked = false;
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('El like no se pudo eliminar');    
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id : this.socialProblem.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                // this.getSocialProblem();
                this.socialProblem.postLiked = true;
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast('El like no pudo guardarse');
            });
        }
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

    // testClass(event) {
    //     event.srcElement.classList.toggle("active");
    //     this.test = (this.test) ? false : true;
    // }

}
