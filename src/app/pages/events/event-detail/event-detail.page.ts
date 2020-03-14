import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { IEvent, IPostShare, IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from "src/app/modals/image_detail/image_detail.page";
import { finalize, map, take } from 'rxjs/operators';
import { getUsersFromDetails, checkUserInDetails } from "src/app/helpers/user-helper";
import { checkLikePost } from "src/app/helpers/user-helper";
import { mapEvent } from "src/app//helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from 'src/app/services/events.service';
import { ErrorService } from 'src/app/services/error.service';
import { CONFIG } from 'src/config/config';
import { MessagesService } from '../../../services/messages.service';


@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.page.html',
    styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

    id: string;
    eventLoaded = false;
    appNetworkConnection = false;
    AuthUser = null;
    eventButtonMessage = CONFIG.EVENT_BUTTON_MESSAGE;
    event: IEvent = null;

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private messagesService: MessagesService,
        private events_app: EventsService,
        private errorService: ErrorService,
        private modalCtrl: ModalController,
        private authService: AuthService) { 
        }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.getEvent();
    }

    getEvent(event?: any, resetEvents?: any) {
        this.eventLoaded = false;
        this.postService.getEvent(+this.id).pipe(
            take(1),
            map((res: any) => {
                if (res && res.data) {
                    const event = res.data;
                    res.data = mapEvent(event);
                }
                return res;
            }),
            finalize(() => {
                this.eventLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            if (res.data) {
                this.event = res.data;
                if (this.event) {
                    this.event.postAssistance = checkLikePost(this.event.reactions, this.AuthUser);
                }
            }
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    toggleAssistance(assistance: boolean) {
        if(!this.AuthUser){
            this.messagesService.showInfo('Debes iniciar sesión para realizar esta acción');
            return;
        }
        if (assistance) {
            this.postService.sendDeleteDetailToPost(this.event.id).subscribe(res => {
                if(res.data.reactions){
                    this.event.postAssistance = false;
                    this.emitAssistanceEvent(this.event.id, res.data.reactions);
                }
            }, err => {
                this.errorService.manageHttpError(err,'No se pudo borrar su asistencia' );
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id: this.event.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                if(res.data.reactions){
                    this.event.postAssistance = true;
                    this.emitAssistanceEvent(this.event.id, res.data.reactions);
                }
            }, err => {
                this.errorService.manageHttpError(err,'No se pudo guardar su asistencia' );
            });
        }
    }

    emitAssistanceEvent(id: number, reactions = []) {
        // this.events_app.resetEventsEmitter(id);
        this.events_app.resetEventsLikesEmitter(id, reactions);
    }

    async sharePost(post: IEvent) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image: this.getImages(post.images),
            url: ''
        };
        await this.utilsService.shareSocial(sharePost);
    }

    getImages($imagesArray) {
        if ($imagesArray) {
            if ($imagesArray.length === 0) {
                return '';
            } else {
                return $imagesArray[0].url;
            }
        } else {
            return '';
        }

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

    seeImageDetail(image: string) {
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

    // emitAssistanceEvent(id: number, reactions: any = []) {
        // this.events_app.resetSocialProblemLikesEmmiter(id, reactions);
    // }
}