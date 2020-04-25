import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { IBasicFilter, IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { finalize, map, catchError } from "rxjs/operators";
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem, setFilterKeys, filterDataInObject, cortarTextoConPuntos, getFirstPostImage } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CONFIG } from 'src/config/config';
import { ErrorService } from 'src/app/services/error.service';
import { of } from 'rxjs';
import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';

@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems-list.page.html',
    styleUrls: ['./social-problems-list.page.scss'],
    animations: [
        trigger('listAnimation', [
          transition('* => *', [
            query(':enter', style({ opacity: 0 }), {optional: true}),
            query(':enter', stagger('300ms', [
              animate('1s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
                style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
              ]))]), {optional: true}),
          ])
        ])
      ]
})
export class SocialProblemsListPage implements OnInit, OnDestroy {

    showLoading = true;
    showNotFound = false;
    subcategory: string;
    AuthUser = null;
    slugSubcategory: string = '';
    filtersToApply: any = { is_attended: "" };
    socialProblemsList: ISocialProblem[] = [];
    socialProblemsFilter: ISocialProblem[] = [];
    filters: IBasicFilter = {
        subcategory_id: {
            name: 'Subcategoria',
            value: "",
            type: 'select',
            options: [
                { id: 1, name: 'Transporte y Tránsito' },
                { id: 2, name: 'Seguridad' },
                { id: 3, name: 'Protección Animal' },
                { id: 4, name: 'Espacios Verdes' }
            ]
        },
        is_attended: {
            name: 'Estado',
            value: "",
            type: 'segment',
            options: [
                { id: 1, name: 'Atendidos' },
                { id: 0, name: 'Pendientes' }
            ]
        }
    };

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

    }

    ngOnInit() {
        this.subcategory = this.activatedRoute.snapshot.paramMap.get('subcategory');
        this.postsService.resetPagination(this.postsService.PaginationKeys.SOCIAL_PROBLEMS);
        this.utilsService.enableMenu();
        this.authService.sessionAuthUser.pipe(
            finalize(() => { })
        ).subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        }, (err: any) => {
            ;
            this.errorService.manageHttpError(err, 'No se pudo cargar la información del usuario');
        });
        this.loadSocialProblems(null, true);
        this.events_app.socialProblemLikesEmitter.subscribe((event_app: any) => {
            this.toggleLikes(event_app.id, event_app.reactions);
        });
    }

    redirectToSearch() {
        this.navCtrl.navigateRoot("/social-problems/search", {
            queryParams: { redirectUrl: this.router.url }
        });
    }

    toggleLikes(id: number, reactions = []) {
        const newSocialProblems = this.socialProblemsList.map((social_problem: any) => {
            social_problem.postLiked = checkLikePost(reactions, this.AuthUser) || false;
            return social_problem;
        });
        // socialProblems = socialProblems.map((social_problem: any) => {
        //     social_problem.postLiked = checkLikePost(social_problem.reactions, this.AuthUser) || false;
        //     return social_problem;
        // });
        this.socialProblemsList = [...newSocialProblems];
        this.socialProblemsFilter = [...this.socialProblemsList];
    }

    ngOnDestroy() { }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetPagination(this.postsService.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY); }
    //Eliminar o agregar like a una publicacion
    toggleLike(like: boolean, id: number) {
        if (like) {
            this.postsService.sendDeleteDetailToPost(id).subscribe((res: any) => {
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        if (res.data.reactions) {
                            social_problem.postLiked = false;
                            social_problem.reactions = res.data.reactions;
                        }
                    }
                });
            }, (err: any) => {
                this.errorService.manageHttpError(err, 'El me gusta no pudo ser borrado');
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postsService.sendCreateDetailToPost(detailInfo).subscribe((res: any) => {
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        if (res.data.reactions) {
                            social_problem.postLiked = true;
                            social_problem.reactions = res.data.reactions;
                        }
                    }
                });
            }, (err: HttpErrorResponse) => {
                this.errorService.manageHttpError(err, 'El me gusta no pudo ser guardado');
            });
        }
    }

    //Cargar los problemas sociales
    loadSocialProblems(event: any = null, first_loading = false) {
        this.postsService.getPostsBySubCategory(CONFIG.SOCIAL_PROBLEMS_SLUG, this.subcategory)
            .pipe(
                map((res: IRespuestaApiSIUPaginada) => {
                    if (res && res.data) {
                        res.data.forEach((social_problem: any) => {
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
                catchError((err: HttpErrorResponse) => {
                    this.errorService.manageHttpError(err, 'Ocurrio un error al traer el listado de problemas sociales', false);
                    this.postsService.resetPaginationEmpty(this.postsService.PaginationKeys.SOCIAL_PROBLEMS_BY_SUBCATEGORY);
                    return of({ data: [] })
                }),
                finalize(() => {
                    if (first_loading) {
                        this.showLoading = false;
                    }
                    if (first_loading && this.socialProblemsList.length === 0) {
                        this.showNotFound = true;
                    }
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
                    return;
                } else if (event && event.type == 'infinite_scroll') {
                    this.socialProblemsList.push(...socialProblems);
                    this.socialProblemsFilter.push(...socialProblems);
                } else {
                    this.socialProblemsList.push(...socialProblems);
                    this.socialProblemsFilter.push(...socialProblems);
                }
            });
    }
    //Obtener datos con el Infinite Scroll
    doInfiniteScroll(event: any) {
        this.loadSocialProblems({
            type: 'infinite_scroll',
            data: event
        });
    }
    //Obtener datos con Refresher
    doRefresh(event: any) {
        this.loadSocialProblems({
            type: 'refresher',
            data: event
        });
    }
    //Ir al detalle de un problema socialc
    postDetail(id: any) {
        this.navCtrl.navigateForward(`/social-problems/list/${this.subcategory}/${id}`);
    }
    //Compartir el Problema Social
    async sharePost(post: ISocialProblem) {
        const sharePost: IPostShare = {
            title: post.title,
            description: cortarTextoConPuntos(post.description, 90),
            image: getFirstPostImage(post),
            url: ''

        };
        await this.utilsService.shareSocial(sharePost);
    }
    //Obtener las imagenes de un post
    getImages($imagesArray: any) {
        if ($imagesArray.length === 0) {
            return '';
        } else {
            return $imagesArray[0].url;
        }
    }
    //Filtrar por Estado Atención
    segmentChanged(event: any) {
        const value = (event.detail.value !== "") ? Number(event.detail.value) : "";
        const type = 'is_attended';
        if (value !== "") {
            const filterApplied = setFilterKeys({ ...this.filtersToApply }, type, value);
            this.filtersToApply = filterApplied;
            this.socialProblemsFilter = filterDataInObject([...this.socialProblemsList], { ...this.filtersToApply });
        } else {
            this.socialProblemsFilter = this.socialProblemsList;
        }
    }

}
