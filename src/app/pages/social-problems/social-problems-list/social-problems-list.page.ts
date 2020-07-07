import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { IRespuestaApiSIUPaginada, IRespuestaApiSIUSingle, IResource, IEventLoad } from 'src/app/interfaces/models';
import { finalize, map, catchError, pluck, exhaustMap, tap, distinctUntilChanged, startWith, skip, switchMap } from "rxjs/operators";
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem, cortarTextoConPuntos, getFirstPostImage } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems-list.page.html',
    styleUrls: ['./social-problems-list.page.scss'],
    animations: [
        trigger('listAnimation', [
            transition('* => *', [
                query(':enter', style({ opacity: 0 }), { optional: true }),
                query(':enter', stagger('300ms', [
                    animate('1s ease-in', keyframes([
                        style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
                        style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
                        style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
                    ]))]), { optional: true }),
            ])
        ])
    ]
})
export class SocialProblemsListPage implements OnInit, OnDestroy {

    requestStatus = '';
    subcategory: string;
    AuthUser = null;
    socialProblemsList: ISocialProblem[] = [];
    socialProblemsFilter: ISocialProblem[] = [];
    socialProblemControl: FormControl;
    segmentFilter$ = new BehaviorSubject(null);
    postState = 1;

    imgError(event, url: string = 'assets/img/default/image_full.png'): void {
        event.target.src = url;
    }

    constructor(
        private router: Router,
        private errorService: ErrorService,
        private activatedRoute: ActivatedRoute,
        private navCtrl: NavController,
        private utilsService: UtilsService,
        private postsService: PostsService,
        private authService: AuthService,
        private events_app: EventsService,
    ) {
        this.socialProblemControl = new FormControl();
    }

    ngOnInit() {
        const peticionHttpBusqueda = (body) => {
            return this.postsService.searchPosts(body)
                .pipe(
                    pluck('data'),
                    map(data => {
                        const social_problems_to_map = data
                        social_problems_to_map.forEach((social_problem) => {
                            social_problem = mapSocialProblem(social_problem);
                            const postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
                            social_problem.postLiked = postLiked;
                        });
                        return social_problems_to_map;
                    }),
                    catchError((error_http) => {
                        this.errorService.manageHttpError(error_http, '');
                        return of([])
                    })
                )
        };

        this.subcategory = this.activatedRoute.snapshot.paramMap.get('subcategory');
        this.postsService.resetPagination(this.postsService.PaginationKeys.SOCIAL_PROBLEMS);
        this.utilsService.enableMenu();

        this.authService.sessionAuthUser.pipe(
            finalize(() => { })
        ).subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        }, (error_http: HttpErrorResponse) => {
            ;
            this.errorService.manageHttpError(error_http, 'No se pudo cargar la información del usuario');
        });
        this.loadSocialProblems(null, true);
        this.events_app.socialProblemLikesEmitter.subscribe((social_problema_event) => {
            this.toggleLikes(social_problema_event.id, social_problema_event.reactions);
        });

        combineLatest(
            this.socialProblemControl.valueChanges.pipe(startWith(''), distinctUntilChanged()),
            this.segmentFilter$.asObservable().pipe(distinctUntilChanged())
        )
            .pipe(
                skip(1),
                tap((val) => {
                    this.requestStatus = 'loading';
                }),
                map(combineValues => ({
                    category: CONFIG.SOCIAL_PROBLEMS_SLUG,
                    subcategory: this.subcategory,
                    title: combineValues[0],
                    status_attendance: combineValues[1],
                    active: this.postState
                })),
                switchMap(peticionHttpBusqueda),
            )
            .subscribe((data: ISocialProblem[]) => {
                this.requestStatus = '';
                this.socialProblemsFilter = [...data];
                if(this.socialProblemsFilter.length == 0){
                    this.requestStatus = 'not-found';
                }else{
                    this.requestStatus = '';
                }
            });
    }

    toggleLikes(social_problem_id: number, reactions = []) {
        const newSocialProblems = this.socialProblemsList.map((social_problem) => {
            if (social_problem.id == social_problem_id) {
                social_problem.reactions = reactions;
            }
            social_problem.postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
            return social_problem;
        });
        this.socialProblemsList = [...newSocialProblems];
        this.socialProblemsFilter = [...this.socialProblemsList];
    }

    ngOnDestroy() { }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetPagination(this.postsService.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY); }
    //Eliminar o agregar like a una publicacion
    toggleLike(like: boolean, id: number) {
        if (like) {
            this.postsService.sendDeleteDetailToPost(id).subscribe((res: IRespuestaApiSIUSingle) => {
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        if (res.data.reactions) {
                            social_problem.postLiked = false;
                            social_problem.reactions = res.data.reactions;
                        }
                    }
                });
                this.socialProblemsFilter = [...this.socialProblemsList];
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'El me gusta no pudo ser borrado');
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postsService.sendCreateDetailToPost(detailInfo).subscribe((res: IRespuestaApiSIUSingle) => {
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        if (res.data.reactions) {
                            social_problem.postLiked = true;
                            social_problem.reactions = res.data.reactions;
                        }
                    }
                });
                this.socialProblemsFilter = [...this.socialProblemsList];
            }, (error_http: HttpErrorResponse) => {
                this.errorService.manageHttpError(error_http, 'El me gusta no pudo ser guardado');
            });
        }
    }

    //Cargar los problemas sociales
    loadSocialProblems(event: IEventLoad = null, first_loading = false) {
        if(!event){
            this.requestStatus = 'loading';
        }
        this.postsService.getPostsBySubCategory(CONFIG.SOCIAL_PROBLEMS_SLUG, this.subcategory, { active: this.postState})
            .pipe(
                map((res: IRespuestaApiSIUPaginada) => {
                    if (res && res.data) {
                        res.data.forEach((social_problem) => {
                            social_problem = mapSocialProblem(social_problem);
                            const postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
                            social_problem.postLiked = postLiked;
                        });
                    }
                    if (res && res.data && res.data.length == 0) {
                        this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY)
                    }
                    return res;
                }),
                catchError((error_http: HttpErrorResponse) => {
                    this.errorService.manageHttpError(error_http, 'Ocurrio un error al traer el listado de problemas sociales', false);
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY);
                    return of({ data: [] })
                })
            ).subscribe((res: IRespuestaApiSIUPaginada) => {
                let socialProblems = [];
                socialProblems = res.data;

                //Evento Completar
                if (event && event.data && event.data.target && event.data.target.complete) {
                    event.data.target.complete();
                }
                if (event && event.data && event.data.target && event.data.target.complete && socialProblems.length == 0) {
                    event.data.target.disabled = true;
                }
                //Acciones segun el tipo de evento
                if (event && event.type === 'refresher') {
                    this.socialProblemsList.unshift(...socialProblems);
                    this.socialProblemsFilter.unshift(...socialProblems);
                    if(this.socialProblemsFilter.length == 0){
                        this.requestStatus = 'not-found';
                    }else{
                        this.requestStatus = '';
                    }
                    return;
                } else if (event && event.type == 'infinite_scroll') {
                    this.socialProblemsList.push(...socialProblems);
                    this.socialProblemsFilter.push(...socialProblems);
                    if(this.socialProblemsFilter.length == 0){
                        this.requestStatus = 'not-found';
                    }else{
                        this.requestStatus = '';
                    }
                    return;
                } else {
                    this.socialProblemsList.push(...socialProblems);
                    this.socialProblemsFilter.push(...socialProblems);
                    if(this.socialProblemsFilter.length == 0){
                        this.requestStatus = 'not-found';
                    }else{
                        this.requestStatus = '';
                    }
                    return;
                }
            });
    }
    //Obtener datos con el Infinite Scroll
    doInfiniteScroll(event: CustomEvent) {
        this.loadSocialProblems({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: CustomEvent) {
        this.loadSocialProblems({
            type: 'refresher',
            data: event
        });
    }
    //Ir al detalle de un problema socialc
    postDetail(id: number) {
        this.navCtrl.navigateForward(`/social-problems/list/${this.subcategory}/${id}`);
    }
    //Compartir el Problema Social
    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: cortarTextoConPuntos(post.description, 90),
            image: getFirstPostImage(post.imagesArr),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }
    //Obtener las imagenes de un post
    getImages($imagesArray: IResource[]) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }
    //Filtrar por Estado Atención
    segmentChanged(event: CustomEvent) {
        const value = (event.detail.value !== "") ? event.detail.value : "";
        if(value == 'rechazado'){
            this.postState = 0
        }else{
            this.postState = 1;
        }
        this.segmentFilter$.next(value);
    }

}
