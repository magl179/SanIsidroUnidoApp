import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { ISocialProblem } from 'src/app/interfaces/barrios';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from '../../../services/posts.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { IPostShare, ISocialProblem } from '../../../interfaces/models';
import { NetworkService } from 'src/app/services/network.service';
import { environment } from "../../../../environments/environment";
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';




@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    postLiked = false;
    test = false;
    id: string;
    idPost: number;
    socialProblem: ISocialProblem = null;
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

    // getImageURL(image: string) {
    //     return this.utilsService.getImageURL(image);
    // }

    //Obtener el detalle de un problema social
    getSocialProblem() {
        this.postService.getSocialProblem(+this.id).subscribe(res => {
            if (res) {
                this.socialProblem = res.data;
                if (this.socialProblem) {
                    this.postLiked = this.utilsService.checkLikePost(this.socialProblem.details, this.AuthUser);
                }
            }
        });
    }

    //Obtener Imagen 
    getImageURL(image_name: string) {
        const imgIsURL = this.utilsService.imgIsURL(image_name);
        return (imgIsURL) ? image_name : `${environment.apiBaseURL}/${environment.image_assets}/${image_name}` ;
    }

    async showImageDetail(image) {
        const modal = await this.modalCtrl.create({
            component: ImageDetailPage,
            componentProps: {
                image
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
                this.getSocialProblem();
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
                this.getSocialProblem();
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

    testClass(event) {
        event.srcElement.classList.toggle("active");
        this.test = (this.test) ? false : true;
    }

}
