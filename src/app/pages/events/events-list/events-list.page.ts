import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { IPostShare } from 'src/app/interfaces/models';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { finalize, map, take } from 'rxjs/operators';
import { IEvent, IRespuestaApiSIUPaginada } from "src/app/interfaces/models";
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapEvent, getImagesPost, cortarTextoConPuntos, getFirstPostImage } from 'src/app/helpers/utils';
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ErrorService } from 'src/app/services/error.service';
import { MessagesService } from '../../../services/messages.service';
import { CONFIG } from '../../../../config/config';
import { Router } from '@angular/router';

@Component({
    selector: 'app-events-list',
    templateUrl: './events-list.page.html',
    styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit, OnDestroy {

    showLoading = true;
    showNotFound = false;
    eventsList: IEvent[] = [];
    AuthUser = null;
    eventButtonMessage = CONFIG.EVENT_BUTTON_MESSAGE;

    constructor(
        private navCtrl: NavController,
        private events_app: EventsService,
        private utilsService: UtilsService,
        private messagesService: MessagesService,
        private postsService: PostsService,
        private authService: AuthService,
        private router: Router,
        private errorService: ErrorService,
    ) {
    }

    ngOnInit() {
        this.postsService.resetEventsPage();
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        });
        this.loadEvents(null,true);
        this.events_app.eventsLikesEmitter.subscribe((event_app: any) => {
            this.toggleLikes(event_app.id, event_app.reactions);
        });
    }

    toggleLikes(id: number, reactions = []) {
        const newEventsList = this.eventsList.map((event: any) => {
            event.postAssistance = checkLikePost(reactions, this.AuthUser) || false;
            return event;
        });
        // socialProblems = socialProblems.map((social_problem: any) => {
        //     social_problem.postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
        //     return social_problem;
        // });
        this.eventsList = [...newEventsList];
    }

    redirectToSearch(){
        this.navCtrl.navigateRoot("/events/search", {
            queryParams: { redirectUrl: this.router.url }
        });
    }

    ngOnDestroy() { }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetEventsPage(); }

    toggleAssistance(assistance: boolean, id: number) {
        if(!this.AuthUser){
            this.messagesService.showInfo('Debes iniciar sesión para realizar esta acción');
            return;
        }
        if (assistance) {
            this.postsService.sendDeleteDetailToPost(id).subscribe((res: any) => {
                this.eventsList.forEach(event => {
                    if (event.id == id) {
                        if(res.data.reactions){
                            event.postAssistance = false;
                            event.reactions = res.data.reactions;
                        }
                    }
                });
            }, err => {
                this.errorService.manageHttpError(err,'No se pudo borrar su asistencia' );
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
                        if(res.data.reactions){
                            event.postAssistance = true;
                            event.reactions = res.data.reactions;
                        }
                    }
                });
            }, err => {
                this.errorService.manageHttpError(err,'No se pudo guardar su asistencia' );
            });
        }
    }

    async sharePost(post: IEvent) {
        const sharePost: IPostShare = {
            title: post.title,
            description: cortarTextoConPuntos(post.description),
            image: getFirstPostImage(post)
        };
        await this.utilsService.shareSocial(sharePost);
    }

    loadEvents(event: any = null, first_loading=false) {
        
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
                if(first_loading){
                    this.showLoading = false;
                }
                if(first_loading && this.eventsList.length === 0){
                    this.showNotFound = true;
                }                
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let eventsApi = [];
            eventsApi = res.data;
            // console.dir('eventsApi', res.data)

            if (eventsApi.length === 0) {
                if (event && event.data && event.data.target && event.data.target.complete) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } else {
                eventsApi.forEach((event: IEvent) => {
                    const postAssistance = checkLikePost(event.reactions, this.AuthUser) || false;
                    event.postAssistance = postAssistance;
                });

            }
            if (event && event.data && event.data.target && event.data.target.complete) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.eventsList.unshift(...eventsApi);
                return;
            }else if(event && event.type == 'infinite_scroll'){
                this.eventsList.push(...eventsApi);
            }else{
                this.eventsList.push(...eventsApi);
            }         
        },
            (err: HttpErrorResponse) => {
                if (err.error instanceof Error) {
                    console.error("Client-side error", err);
                } else {
                    console.error("Server-side error", err);
                }
            });
    }

    postDetail(id: number) {
        this.navCtrl.navigateForward(`/events/detail/${id}`);
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
