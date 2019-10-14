import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from '@ionic/angular';
import { IBasicFilter } from 'src/app/interfaces/models';
import { PostsService } from "src/app/services/posts.service";
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from "@angular/common/http";
import { UtilsService } from "../../services/utils.service";
import { manageErrorHTTP } from "../../helpers/utils";




@Component({
    selector: 'modal-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

    data: any;
    filteringPosts = false;
    defaulText: string;
    filters: any;
    dataFiltered: any = [];
    filtersToApply: any = {};
    filterInApi = false;
    postTypeSlug = null;

    constructor(
        private modalCtrl: ModalController,
        private navParams: NavParams,
        private utilsService: UtilsService,
        private postsService: PostsService
    ) {
        this.defaulText = (this.navParams.data.defaulText) ? this.navParams.data.defaulText : 'Todas';
        this.data = this.navParams.data.data;
        this.filters = this.navParams.data.filters;
        this.dataFiltered.push(...this.data);
        this.filterInApi = (this.navParams.data.filterInApi) ? this.navParams.data.filterInApi : false;
        this.postTypeSlug = (this.navParams.data.postTypeSlug) ? this.navParams.data.postTypeSlug : null;
        console.log('Filter params received', this.navParams);
    }

    ngOnInit() { }

    closeModal() {
        this.modalCtrl.dismiss({
            'data': this.dataFiltered,
            'filters': this.filters
        });
    }

    closeModalEmpty() {
        this.modalCtrl.dismiss();
    }

    applyFilter(event: any, type: any, filterUIType: string) {
        for (const prop in this.filters) {
            if (prop === type) {
                if (event.detail.value === "") {
                    delete this.filtersToApply[prop];
                } else {
                    this.filters[prop].value = (filterUIType === 'segment') ? Number(event.detail.value) : event.detail.value;
                    this.filtersToApply[prop] = this.filters[prop].value;
                }
            }
        }
        this.dataFiltered = this.getDataFiltered(this.data, this.filtersToApply);
    }

    getDataFiltered(items: any[], filter: { [key: string]: any }) {
        let itemsFiltered = [];
        //Verificar si se debe filtrar en la API
        if (!this.filterInApi) {            
            //Recorrer los Filtros a Aplicar   
            this.filteringPosts = true;
            itemsFiltered = this.filterData(items, filter);
            this.filteringPosts = false;
        } else if (this.filterInApi && this.postTypeSlug) {
           
            this.filteringPosts = true;
            this.postsService.filterPosts(filter, this.postTypeSlug).pipe(
                finalize(() => {
                    this.filteringPosts = false;
                })
            ).subscribe((res: any) => {
                console.log('events search', res);
                itemsFiltered = [...res.data];
                if (res.data.length === 0) {
                    console.log('No hay coincidencias');
                } else {
                    console.log(`Hay ${this.dataFiltered.length} coincidencias`);
                }
            }, (err: HttpErrorResponse) => {
                    this.utilsService.showToast(manageErrorHTTP(err, 'Ocurrio un error al filtrar los datos'));
            });
        }
        console.log('items was filtered', itemsFiltered);
        return itemsFiltered;
    }

    filterData = (data: any[], filter: {}) =>{
        let new_data = data.filter(function(item) {
          for (var key in filter) {
            if (item[key] === undefined || item[key] != filter[key])
              return false;
          }
          return true;
        });
        return new_data;
    } 

    filterByKeys(post: any) {
        const keys = Object.keys(this.filters);
        const postFilter = Object.entries(post).filter(([key, value]) => {
            return keys.includes(key);
        });
        return JSON.stringify(postFilter);
    }

}
