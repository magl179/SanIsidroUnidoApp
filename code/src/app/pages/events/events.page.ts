import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { IPostShare } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from "src/environments/environment";
import { finalize, map, take } from 'rxjs/operators';
import { SearchPage } from "src/app/modals/search/search.page";
import { IEvent, IRespuestaApiSIUPaginada } from "src/app/interfaces/models";
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapEvent, getImagesPost } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "../../services/events.service";

@Component({
    selector: 'app-events',
    templateUrl: './events.page.html',
    styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {

    eventsLoaded = false;
    eventsList: IEvent[] = [];
    AuthUser = null;

    constructor(
        private navCtrl: NavController,
        private events_app: EventsService,
        private utilsService: UtilsService,
        private postService: PostsService,
        private authService: AuthService,
        private modalCtrl: ModalController,
    ) {
        console.log('Constructor Eventos');
    }

    ngOnInit() {
        this.utilsService.enableMenu();
        this.postService.resetEventsPage();
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        console.log('llamada get events sin parametros');
        this.loadEvents();
        this.events_app.eventsEmitter.subscribe((event_app: any) => {
            if (this.eventsList.length > 0) {
                console.log('tengo datos cargados resetear a 0');
                this.eventsList = [];
                this.postService.resetEventsPage();
            }
            this.loadEvents();
        });
    }

    ngOnDestroy() {
        console.warn('EVENTS PAGE DESTROYED')
    }

    getOptionSelected(event: any) {
        console.log('option selected', event)
        if (event && event.option) {
            switch (event.option) {
                case 'search':
                    this.showModalSearchEvents();
                    break;
                default:
                    console.log('Ninguna opcion coincide');
            }
        }
    }

    toggleAssistance(assistance: boolean, id: number) {
        if (assistance) {
            this.postService.sendDeleteDetailToPost(id).subscribe(res => {
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        event.postAssistance = false;
                    }
                });
            }, err => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast({message: 'La asistencia no pudo ser eliminada'});
            });
        } else {
            const detailInfo = {
                type: 'assistance',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postService.sendCreateDetailToPost(detailInfo).subscribe((res: any) => {
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        event.postAssistance = true;
                    }
                });
            }, err => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast({message: 'No se pudo crear la asistencia'});
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

    loadEvents(event?: any) {
        this.eventsLoaded = false;
        this.postService.getEvents().pipe(
            take(1),
            map((res: any) => {
                if (res && res.data && res.data.data) {
                    // const events_to_map = res.data.data;
                    res.data.data.forEach((event: any) => {
                        event = mapEvent(event);
                    });
                }
                return res;
            }),
            finalize(() => {
                this.eventsLoaded = true;

            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let eventsApi = [];
            eventsApi = res.data.data;
            console.log('eventos ante subscribir', this.eventsList);

            if (eventsApi.length === 0) {
                if (event) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } else {
                eventsApi.forEach((event: any) => {
                    const postAssistance = checkLikePost(event.details, this.AuthUser) || false;
                    event.postAssistance = postAssistance;
                });

            }
            if (event) {
                event.data.target.complete();
            }
            console.log('eventos api a pushear', eventsApi);
            if (event && event.type === 'refresher') {
                this.eventsList.unshift(...eventsApi);
                console.log('eventos mapeados refresher y totales actualmente', this.eventsList);
                return;
            }
            this.eventsList.push(...eventsApi);
            console.log('eventos mapeados inf scroll y totales actualmente', this.eventsList);
            

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
    //Obtener datos con el Infinite Scroll
    getInfiniteScrollData(event: any) {
        this.loadEvents({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: any) {
        this.loadEvents({
            type: 'refresher',
            data: event
        });
    }

}
