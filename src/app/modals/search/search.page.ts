import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { PostsService } from "src/app/services/posts.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'modal-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    searchIdeas = ['ferguson', 'Manual', 'Byron', 'Calderon', 'Lolita'];
    routeDetail = null;
    postTypeSlug = null;
    searchInApi = false;
    searchingPosts = false;
    itemsSearchFound = null;
    searchPlaceholder = '';
    valueToSearch = new BehaviorSubject('');
    itemsSearchAvalaible = [];
    fieldsToSearch: any[] = [];

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private postsService: PostsService,
        private navCtrl: NavController
    ) {
        this.searchPlaceholder = this.navParams.data.searchPlaceholder;
        this.searchIdeas = this.navParams.data.searchIdeas;
        this.itemsSearchAvalaible = this.navParams.data.originalSearchData;
        this.routeDetail = this.navParams.data.routeDetail;
        this.searchInApi = (this.navParams.data.searchInApi) ? this.navParams.data.searchInApi : false;
        this.postTypeSlug = (this.navParams.data.postTypeSlug) ? this.navParams.data.postTypeSlug : null;
        this.fieldsToSearch = ['title', 'description'];
    }

    seeDetailItemFound(id: any) {
        if (this.routeDetail) {
            this.modalCtrl.dismiss().then(() => {
                this.navCtrl.navigateForward(`${this.routeDetail}/${id}`);
            });
        }
    }

    closeModal() {
        this.modalCtrl.dismiss();
    }

    getValueObservable() {
        return this.valueToSearch.asObservable();
    }

    execSearchPosts(event: any) {
        this.valueToSearch.next(event.detail.value);
    }
    ngOnInit() {
        this.getValueObservable().pipe(
            map(search_term => search_term),
            debounceTime(1000),
            distinctUntilChanged(),
            finalize(() => {
                this.searchingPosts = false;
            }),
        ).subscribe(async value => {
            this.searchingPosts = true;
            if (value.length === 0) {
                this.searchingPosts = false;
                this.itemsSearchFound = null;
                return;
            }
            if (!this.searchInApi) {
                setTimeout(async () => {
                    const items_found = await this.itemsSearchAvalaible.filter(item => {
                        let item_match = false;
                        const search_term = new RegExp(value.toLowerCase(), 'g');
                        if (this.fieldsToSearch.length > 0) {
                            this.fieldsToSearch.forEach(field => {
                                if (item[field].toLowerCase().search(search_term) != -1) {
                                    item_match = true;
                                }
                            });
                            return item_match;
                        } else {
                            return true;
                        }

                    });
                    this.itemsSearchFound = items_found;
                    if (this.itemsSearchFound.length === 0) {
                        console.log('No hay coincidencias');
                    } else {
                        console.log(`Hay ${this.itemsSearchFound.length} coincidencias`);
                    }
                    this.searchingPosts = false;
                }, 2000);
            } else if (this.searchInApi && this.postTypeSlug) {
                this.searchingPosts = true;
                this.postsService.searchPosts({}).pipe(
                    finalize(() => {
                        this.searchingPosts = false;
                    })
                ).subscribe((res: any) => {
                    this.itemsSearchFound = res.data;
                    if (res.data.length === 0) {
                        console.log('No hay coincidencias');
                    } else {
                        console.log(`Hay ${this.itemsSearchFound.length} coincidencias`);
                    }
                },(err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        console.log("Client-side error", err);
                    } else {
                        console.log("Server-side error", err);
                    }
                });
            }
        });
    }

}
