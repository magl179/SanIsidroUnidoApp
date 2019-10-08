import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { IEvent, IPostShare, IRespuestaApiSIUSingle } from "src/app/interfaces/models";
import { NetworkService } from 'src/app/services/network.service';
import { ModalController } from "@ionic/angular";
import { ImageDetailPage } from "src/app/modals/image_detail/image_detail.page";
import { finalize, map } from 'rxjs/operators';
import { getUsersFromDetails, checkUserInDetails } from "src/app/helpers/user-helper";
import { checkLikePost } from "src/app/helpers/user-helper";
import { getJSON, mapImagesApi } from "src/app/helpers/utils";
import { mapEvent } from "../../helpers/utils";


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

    // mapPoints: ISimpleUbicationItem = {
    //     latitude: 0.0456696,
    //     longitude: -78.14502999999999,
    //     title: 'Ubicación del Evento'
    // };

    constructor(
        private route: ActivatedRoute,
        private utilsService: UtilsService,
        private postService: PostsService,
        private modalCtrl: ModalController,
        private networkService: NetworkService,
        private authService: AuthService) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        // console.log('ID RECIBIDO:', this.id);
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
            map((res: any) => {
                console.log('res map', res);
                if (res && res.data) {
                    const event = res.data;
                    res.data = mapEvent(event);
                    console.log('res maped', res.data);
                }
                return res;
            }),
            finalize(() => {
                this.eventLoaded = true;
            })
        ).subscribe((res: IRespuestaApiSIUSingle) => {
            if (res.data) {
                this.event = res.data;
                // if (this.event) {
                //     this.event.postAssistance = checkLikePost(this.event.details, this.AuthUser);
                //     this.event.ubication = getJSON(this.event.ubication);
                //     this.event.fulldate = `${this.event.date} ${this.event.time}`;
                //     if (this.event.images && this.event.images.length > 0) {
                //         this.event.images = mapImagesApi(this.event.images);
                //     }
                // }
            }

        });
    }

    getFullDate(date, time) {
        const fulldate = `${date} ${time}`;
        return fulldate;
    }


    checkLikePost($details) {
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
                console.log('detalle eliminado correctamente');
                // this.getEvent();
                this.event.postAssistance = false;
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('La asistencia no ha podido ser eliminada');
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id: this.event.id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                // this.getEvent();
                this.event.postAssistance = true;
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast('No se pudo guardar la asistencia');
            });
        }
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

    getBGCover(image_cover: string) {
        return `linear-gradient(to bottom, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.23)), url('${image_cover}')`;
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
        // if
    }

    seeImageDetail(image: string) {
        console.log('see image', image)
        this.utilsService.seeImageDetail(image, 'Imagen Evento');
    }

}
//