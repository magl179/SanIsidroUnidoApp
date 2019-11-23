import { Component, OnInit } from '@angular/core';
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
    event: IEvent = null;

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private events_app: EventsService,
        private modalCtrl: ModalController,
        private authService: AuthService) { }

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
                    this.event.postAssistance = checkLikePost(this.event.details, this.AuthUser);
                }
            }
            console.log('evento mapeado', this.event);
        },(err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
            }
        });
    }

    checkLikePost($details: any) {
        if ($details && $details.length > 0) {
            const likes_user = getUsersFromDetails($details);
            const user_made_like = checkUserInDetails(this.AuthUser.id, likes_user);
            return user_made_like;
        }
        else {
            return false;
        }
    }

    toggleAssistance(assistance: boolean) {
        console.log((assistance) ? 'quitar assistencia' : 'dar asistencia');
        if (assistance) {
            this.postService.sendDeleteDetailToPost(this.event.id).subscribe(res => {
                this.event.postAssistance = false;
                this.emitAssistanceEvent();
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast({message: 'La asistencia no ha podido ser eliminada'});
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id: this.event.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                this.event.postAssistance = true;
                this.emitAssistanceEvent();
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast({message: 'No se pudo guardar la asistencia'});
            });
        }
    }

    emitAssistanceEvent() {
        this.events_app.resetEventsEmitter();
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
        console.log('see image', image)
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }
}