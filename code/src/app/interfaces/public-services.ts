export interface PublicServicesComponente {
    name: string;
    description: string;
    phone?: string;
    ubication: CoordinatesMap;
}

interface CoordinatesMap {
    latitude: string;
    longitude: string;
}
