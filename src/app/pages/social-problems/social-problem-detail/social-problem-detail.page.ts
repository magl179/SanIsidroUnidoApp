import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { IPostShare, ISocialProblem, IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from 'src/app/modals/image_detail/image_detail.page';
import { finalize, map, take } from 'rxjs/operators';;
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem, cortarTextoConPuntos, getFirstPostImage } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { MessagesService } from 'src/app/services/messages.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
    selector: 'app-social-problem-detail',
    templateUrl: './social-problem-detail.page.html',
    styleUrls: ['./social-problem-detail.page.scss'],
})
export class SocialProblemDetailPage implements OnInit {

    backUrl: string;
    id: string;
    subcategory: string;
    socialProblem: ISocialProblem = null;
    socialProblemLoaded = false;
    AuthUser = null;
    appNetworkConnection = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private errorService: ErrorService,
        private postService: PostsService,
        public utilsService: UtilsService,
        private events_app: EventsService,
        private modalCtrl: ModalController,
        private messagesService: MessagesService,
        private authService: AuthService) {
       
    }

    async ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        this.subcategory = this.activatedRoute.snapshot.paramMap.get('subcategory');
        this.backUrl = `social-problems/list/${this.subcategory}`
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        }, () => {
            this.messagesService.showError("Ocurrio un error al traer los datos del usuario autenticado'");
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
                this.socialProblem.postLiked = checkLikePost(this.socialProblem.reactions, this.AuthUser);
            }
        }, (error_http: HttpErrorResponse) => {
            this.errorService.manageHttpError(error_http, 'Ocurrio un error al traer el detalle del problema social ');
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
        if (like) {
            this.postService.sendDeleteDetailToPost(this.socialProblem.id).subscribe((res: any) => {
                if(res.data.reactions){
                    this.socialProblem.postLiked = false;
                    this.socialProblem.reactions = res.data.reactions;
                    this.emitLikeEvent(this.socialProblem.id, res.data.reactions);
                }
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'El me gusta no pudo ser borrado');
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id: this.socialProblem.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe((res: any) => {
                if(res.data.reactions){
                    this.socialProblem.postLiked = true;
                    this.socialProblem.reactions = res.data.reactions;
                    this.emitLikeEvent(this.socialProblem.id, res.data.reactions);
                }
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'El me gusta no pudo ser guardado');
            });
        }
    }

    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: cortarTextoConPuntos(post.description, 80),
            image: getFirstPostImage(post),
            url: ''
        };
        await this.utilsService.shareSocial(sharePost);
    }

    getImages($imagesArray: any[]) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }

    seeImageDetail(image: string) {
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

    emitLikeEvent(id: number, reactions: any = []) {
        this.events_app.resetSocialProblemLikesEmmiter(id, reactions);
    }

}
