import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { NavController, IonSearchbar } from '@ionic/angular';
import { distinctUntilChanged, tap, filter, catchError, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ITokenDecoded } from 'src/app/interfaces/models';
import { IPost } from 'src/app/interfaces/models';

@Component({
    selector: 'app-search-posts',
    templateUrl: './search-posts.page.html',
    styleUrls: ['./search-posts.page.scss'],
})
export class SearchPostsPage implements OnInit, OnDestroy {

    @ViewChild('searchPostBar') searchPostBar: IonSearchbar;
    searchIdeas: string[] = [];
    recentSearches: string[] = ['js'];
    searchPlaceholder = '';
    searchSlug = '';
    searchRouteDetail = '';
    redirectUrl = null;

    itemsSearchFound: IPost[] = [];
    searchingPosts = false;
    resultsNotFound = false;
    valueToSearch = new BehaviorSubject('');
    requestStatus = '';
    includeUserFilter = false;
    redirectWith = 'id';
    AuthUser: ITokenDecoded = null;
    private searchSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private postsService: PostsService,
        private navCtrl: NavController
    ) {
    }

    seeDetailItemFound(category: string, subcategory: string, id: number) {
        let urlRedirect = '';
        switch (this.redirectWith) {
            case 'category+subcategory+id':
                urlRedirect = `${this.searchRouteDetail}/${category}/${subcategory}/${id}`;
                break;
            case 'subcategory+id':
                urlRedirect = `${this.searchRouteDetail}/${subcategory}/${id}`;
                break;
            default:
                urlRedirect = `${this.searchRouteDetail}/${id}`;//id
                break;
        }
        this.navCtrl.navigateForward(urlRedirect);

    }

    execSearchPosts(event: any) {
        this.valueToSearch.next(event.detail.value);
    }

    setInitialValues() {
        const routeData = this.activatedRoute.snapshot.data;
        this.searchIdeas = (routeData.searchIdeas) ? routeData.searchIdeas : ['ferguson', 'Manual', 'Byron', 'Calderon', 'Lolita'];
        this.searchPlaceholder = (routeData.searchPlaceholder) ? routeData.searchPlaceholder : 'Buscar Publicaciones';
        this.searchSlug = (routeData.searchSlug) ? routeData.searchSlug : '';
        this.searchRouteDetail = (routeData.searchRouteDetail) ? routeData.searchRouteDetail : '';
        this.includeUserFilter = (routeData.includeUserFilter) ? (routeData.includeUserFilter) : false;
        this.redirectWith = (routeData.redirectWith) ? (routeData.redirectWith) : false;
        // this.searchIdeas = ['j'];
    }

    ngOnInit() {
        this.activatedRoute.queryParamMap.subscribe((params_map: any) => {
            if (params_map.params) {
                this.redirectUrl = (params_map.params.redirectUrl) ? params_map.params.redirectUrl : '/home-list';
            }
        });

        this.setInitialValues();
        this.authService.sessionAuthUser.subscribe(async (token_decoded: ITokenDecoded) => {
            if (token_decoded) {
                this.AuthUser = token_decoded;
            }
        });

        this.searchSubscription = this.valueToSearch.asObservable().pipe(
            filter(value => {
                this.requestStatus = ''
                if (value == '') {
                    this.itemsSearchFound = [];
                }
                return value !== '';
            }),
            distinctUntilChanged(),
            tap(() => this.searchingPosts = true),
            // debounceTime(100),
            switchMap(search_term => {
                this.requestStatus = '';
                let searchParams = {};
                if (this.includeUserFilter) {
                    searchParams = {
                        'category': this.searchSlug,
                        'user': this.AuthUser.user.id,
                        'title': search_term
                    }
                } else {
                    searchParams = {
                        'category': this.searchSlug,
                        'title': search_term
                    }
                }
                return this.postsService.searchPosts(searchParams);
            }),
            catchError((err: HttpErrorResponse) => {
                this.itemsSearchFound = [];
                this.requestStatus = 'fails';
                this.searchingPosts = false;
                return of({ data: [] })
            })
        ).subscribe(
            {
                next: async (response: any) => {
                    this.itemsSearchFound = response.data;
                    this.requestStatus = 'success';
                    if (response.data.length === 0) {
                        this.resultsNotFound = true;
                    } else {
                        this.resultsNotFound = false;
                    }
                    this.searchingPosts = false;
                }
            });
    }


    ngOnDestroy() {
        this.searchSubscription.unsubscribe();
    }

}
