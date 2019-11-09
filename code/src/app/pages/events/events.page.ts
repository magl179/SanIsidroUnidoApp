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
        private postsService: PostsService,
        private authService: AuthService,
        private modalCtrl: ModalController,
    ) {
        console.log('Constructor Eventos');
    }

    ngOnInit() {
        this.postsService.resetEventsPage();
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.loadEvents();
        this.events_app.eventsEmitter.subscribe((event_app: any) => {
            if (this.eventsList.length > 0) {
                console.log('tengo datos cargados resetear a 0');
                this.eventsList = [];
                this.postsService.resetEventsPage();
            }
            this.loadEvents();
        });
    }

    ngOnDestroy() { console.warn('EVENTS PAGE DESTROYED') }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetEventsPage(); }

    toggleAssistance(assistance: boolean, id: number) {
        if (assistance) {
            this.postsService.sendDeleteDetailToPost(id).subscribe(res => {
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
            this.postsService.sendCreateDetailToPost(detailInfo).subscribe((res: any) => {
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

    loadEvents(event?: any) {
        this.eventsLoaded = false;
        this.postsService.getEvents().pipe(
            take(1),
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data && res.data) {
                    res.data.forEach((event: any) => {
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
            eventsApi = res.data;
            // console.log('eventos ante subscribir', this.eventsList);
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
            if (event && event.type === 'refresher') {
                this.eventsList.unshift(...eventsApi);
                console.log('eventos mapeados refresher y totales actualmente', this.eventsList);
                return;
            }
            this.eventsList.push(...eventsApi);
            console.log('eventos mapeados normal o infinite scroll', this.eventsList);
            

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
        this.navCtrl.navigateForward(`/events-tabs/detail/${id}`);
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
