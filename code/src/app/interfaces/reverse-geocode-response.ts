export interface ReverseGeocodeResponse {
    readonly place_id: string;
    readonly licence: string;
    readonly osm_type: string;
    readonly osm_id: string;
    readonly lat: string;
    readonly lon: string;
    readonly display_name: string;
    readonly boundingbox: string[];
}
