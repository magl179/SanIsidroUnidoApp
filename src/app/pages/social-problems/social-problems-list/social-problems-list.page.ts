import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from "@ionic/angular";
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from 'src/app/services/posts.service';
import { IBasicFilter, IRespuestaApiSIU, IRespuestaApiSIUPaginada } from 'src/app/interfaces/models';
import { finalize, map } from "rxjs/operators";
import { ISocialProblem, IPostShare } from 'src/app/interfaces/models';
import { environment } from 'src/environments/environment';
import { checkLikePost } from 'src/app/helpers/user-helper';
import { mapSocialProblem, setFilterKeys, filterDataInObject } from "src/app/helpers/utils";
import { HttpErrorResponse } from '@angular/common/http';
import { EventsService } from "src/app/services/events.service";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { NavigationService } from 'src/app/services/navigation.service';
import { CONFIG } from 'src/config/config';


@Component({
    selector: 'app-social-problems',
    templateUrl: './social-problems-list.page.html',
    styleUrls: ['./social-problems-list.page.scss'],
})
export class SocialProblemsListPage implements OnInit, OnDestroy {

    showLoading = true;
    subcategory: string;
    AuthUser = null;
    slugSubcategory: string = '';
    filtersToApply: any = { is_attended: ""};
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
        this.postsService.resetSocialProblemsPage();
        this.utilsService.enableMenu();
        // console.log('ng on init',  this.subcategory);
        this.authService.sessionAuthUser.pipe(
            finalize(() => { })
        ).subscribe(token_decoded => {
            if (token_decoded && token_decoded.user) {
                this.AuthUser = token_decoded.user;
            }
        },(err: any) => {
                console.log('Error al traer la informacion del usuario', err);
                this.utilsService.showToast({message: 'No se pudieron cargar la información del usuario'});
        });
        this.loadSocialProblems(null, true);
        this.events_app.socialProblemEmitter.subscribe((event_app: any) => {
            if (this.socialProblemsList.length > 0) {
                console.log('tengo datos cargados resetear a 0');
                this.socialProblemsList = [];
                this.socialProblemsFilter = [];
                this.postsService.resetSocialProblemsPage();
            }
            this.loadSocialProblems();
        });
    }

    ngOnDestroy() { console.warn('SOCIAL PROBLEMS PAGE DESTROYED') }
    ionViewWillEnter() { }
    ionViewWillLeave() { this.postsService.resetSocialProblemsBySubcategoryPage(); }
    //Eliminar o agregar like a una publicacion
    toggleLike(like: boolean, id: number) {
        if (like) {
            this.postsService.sendDeleteDetailToPost(id).subscribe((res: IRespuestaApiSIU) => {
                console.log('detalle eliminado correctamente');
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        social_problem.postLiked = false;
                    }
                });
            }, (err: any) => {
                console.log('detalle no se pudo eliminar', err);
                this.utilsService.showToast({message: 'No se pudo guardar tu dislike'});
            });
        } else {
            const detailInfo = {
                type: 'like',
                user_id: this.AuthUser.id,
                post_id: id
            }
            this.postsService.sendCreateDetailToPost(detailInfo).subscribe((res: IRespuestaApiSIU) => {
                console.log('detalle creado correctamente');
                this.socialProblemsList.forEach(social_problem => {
                    if (social_problem.id === id) {
                        social_problem.postLiked = true;
                    }
                });
            }, (err: any) => {
                console.log('detalle no se pudo crear', err);
                this.utilsService.showToast({message: 'No se pudo guardar tu like'});
            });
        }
    }

    //Cargar los problemas sociales
    loadSocialProblems(event: any = null, first_loading=false) {
        this.postsService.getPostsBySubCategory(CONFIG.SOCIAL_PROBLEMS_SLUG, this.subcategory).pipe(
            map((res: IRespuestaApiSIUPaginada) => {
                if (res && res.data) {
                    res.data.forEach((social_problem: any) => {
                        social_problem = mapSocialProblem(social_problem);
                    });
                }
                return res;
            }),
            finalize(() => {
                if(first_loading){
                    this.showLoading = false;
                }
            })
        ).subscribe((res: IRespuestaApiSIUPaginada) => {
            let socialProblems = [];
            socialProblems = res.data;
            if (socialProblems.length === 0) {
                if (event) {
                    event.data.target.disabled = true;
                    event.data.target.complete();
                }
                return;
            } else {
                socialProblems = socialProblems.map((social_problem: any) => {
                    social_problem.postLiked = checkLikePost(social_problem.details, this.AuthUser) || false;
                    return social_problem;
                });
            }
            if (event) {
                event.data.target.complete();
            }
            if (event && event.type === 'refresher') {
                this.socialProblemsList.unshift(...socialProblems);
                this.socialProblemsFilter.unshift(...socialProblems);
                return;
            }else if(event && event.type == 'infinite_scroll'){
                this.socialProblemsList.push(...socialProblems);
                this.socialProblemsFilter.push(...socialProblems);
            }else{
                this.socialProblemsList.push(...socialProblems);
                this.socialProblemsFilter.push(...socialProblems);
            }
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log("Client-side error", err);
            } else {
                console.log("Server-side error", err);
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
            description: post.description,
            image: this.getImages(post.images),
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
            const filterApplied = setFilterKeys({...this.filtersToApply}, type, value);
            this.filtersToApply = filterApplied;
            this.socialProblemsFilter = filterDataInObject([...this.socialProblemsList], {...this.filtersToApply});
        } else {
            this.socialProblemsFilter = this.socialProblemsList;
        }
        // console.log('data changed', this.socialProblemsFilter.length);
    }

}
