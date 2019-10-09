import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { IPostShare } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from "src/environments/environment";
import { finalize, map } from 'rxjs/operators';
import { SearchPage } from "src/app/modals/search/search.page";
import { IEvent, IRespuestaApiSIUPaginada } from "src/app/interfaces/models";
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapImagesApi, getJSON, mapEvent, getImagesPost } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

    eventsLoaded = false;
    eventsList: IEvent[] = [];
    AuthUser = null;

    constructor(
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService,
        private modalCtrl: ModalController,
        private actionSheetCtrl: ActionSheetController
    ) {
        console.log('Constructor Eventos');
    }

    ngOnInit() {
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.loadEvents();
    }

    ionViewWillEnter() { }

    async showActionCtrl(event: IEvent) {
        const actionShare = {
            text: 'Compartir',
            icon: 'share',
            cssClass: ['share-event'],
            handler: () => {
                console.log('compartir evento', event);
                this.sharePost(event);
            }
        }
        const actionToggleAssistance = {
            text: (event.postAssistance) ? 'Unirme' : 'Ya no me interesa',
            icon: 'clipboard',
            cssClass: ['toggle-assistance'],
            handler: () => {
                console.log('Favorito Borrado');
                this.toggleAssistance(event.postAssistance, event.id);
            }
        }

        const actionSheet = await this.actionSheetCtrl.create({
            buttons: [
                actionShare,
                actionToggleAssistance, {
                    text: 'Cancelar',
                    icon: 'close',
                    cssClass: ['cancel-action'],
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await actionSheet.present();
    }

    toggleAssistance(assistance: boolean, id: number) {
        if (assistance) {
            this.postService.sendDeleteDetailToPost(id).subscribe(res => {
                console.log('detalle eliminado correctamente');
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        event.postAssistance = false;
                    }
                });
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast('La asistencia no pudo ser eliminada');
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe(res => {
                console.log('detalle creado correctamente');
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        event.postAssistance = true;
                    }
                });
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast('No se pudo eliminar la asistencia');
            });
        }
    }

    async sharePost(post: IEvent) {
        const sharePost: IPostShare = {
            title: post.title,
            description: post.description,
            image: getImagesPost(post.images),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }

    async showModalSearchEvents() {
        const modal = await this.modalCtrl.create({
            component: SearchPage,
            componentProps: {
                searchPlaceholder: 'Buscar Eventos',
                searchIdeas: [],
                originalSearchData: [...this.eventsList],
                routeDetail: '/event-detail',
                fieldsToSearch: ['title', 'description'],
                searchInApi: true,
                postTypeSlug: environment.eventsSlug
            }
        });
        await modal.present();
    }

    loadEvents(event?: any, resetEvents = false) {
        this.eventsLoaded = false;
        this.postService.getEvents().pipe(
            map((res: any) => {
                // console.log('res map', res);
                if (res && res.data && res.data.data) {
                    // const events_to_map = res.data.data;
                    res.data.data.forEach((event: any) => {
                        event = mapEvent(event);
                    });
                    // console.log('res maped', res.data.data);
                }
                return res;
            }),
            finalize(() => {
                this.eventsLoaded = true;

            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let eventsApi = [];
            eventsApi.push(...res.data.data);

            if (eventsApi.length === 0) {
                // conso
                if (event) {
                    event.target.disabled = true;
                    event.target.complete();
                }
                return;
            } else {
                eventsApi.forEach((event: any) => {
                    const postAssistance = checkLikePost(event.details, this.AuthUser) || false;
                    event.postAssistance = postAssistance;
                });
            }
            this.eventsList.push(...eventsApi);
            if (event) {
                event.target.complete();
            }

        },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.log("Client-side error", err);
                } else {
                    console.log("Server-side error", err);
                }
            });
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/event-detail/${id}`);
    }

    getInfiniteScrollData(event: any) {
        this.loadEvents(event);
    }

}
