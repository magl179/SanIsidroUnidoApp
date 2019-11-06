import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { IPostShare, ISocialProblem, IRespuestaApiSIUSingle, IRespuestaApiSIU } from "src/app/interfaces/models";
import { NetworkService } from 'src/app/services/network.service';
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { finalize, map, take } from 'rxjs/operators';;
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem } from "../../helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "../../services/events.service";




@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    id: string;
    slugSubcategory: string;
    socialProblem: ISocialProblem = null;
    socialProblemLoaded = false;
    AuthUser = null;
    appNetworkConnection = false;

    constructor(
        private route: ActivatedRoute,
        private postService: PostsService,
        public utilsService: UtilsService,
        private events_app: EventsService,
        private modalCtrl: ModalController,
        private networkService: NetworkService,
        private authService: AuthService) { }

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.slugSubcategory = this.route.snapshot.paramMap.get('slug_subcategory');
        this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
            this.appNetworkConnection = connected;
        });
        
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user; 
            }
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
            take(1),
            map((res: any) => {
                if (res && res.data) {
                    const social_problem = res.data;
                    res.data = mapSocialProblem(social_problem);
                }
                return res;
            }),
            finalize(() => {
                this.socialProblemLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            if (res.data) {
                this.socialProblem = res.data;
                this.socialProblem.postLiked = checkLikePost(this.socialProblem.details, this.AuthUser);
            }
            console.log('problema social mapeado', this.socialProblem);
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    getBGCover(image_cover: any) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
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

    toggleLike(like: boolean) {
        console.log((like) ? 'quitar like' : 'dar like');
        if (like) {
            this.postService.sendDeleteDetailToPost(this.socialProblem.id).subscribe((res: IRespuestaApiSIU) => {
                console.log('detalle eliminado correctamente');
                this.socialProblem.postLiked = false;
                this.emitLikeEvent();
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast({message: 'El like no se pudo guardar'});    
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id : this.socialProblem.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe((res: IRespuestaApiSIU) => {
                console.log('detalle creado correctamente');
                this.socialProblem.postLiked = true;
                this.emitLikeEvent();
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast({message: 'El like no pudo guardarse'});
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

    seeImageDetail(image: string) {
        console.log('see image', image)
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

    emitLikeEvent() {
        this.events_app.resetSocialProblemEmmiter();
    }

}
