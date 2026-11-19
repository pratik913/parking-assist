export type ParkingKind='PRIVATE'|'PUBLIC_AUTHORIZED';
export type VehicleType='TWO_WHEELER'|'FOUR_WHEELER';
export interface ParkingListing{readonly id:string;readonly name:string;readonly address:string;readonly locality:string;readonly city:string;readonly kind:ParkingKind;readonly availability:'AVAILABLE'|'LIMITED'|'FULL';readonly hourlyRate:number;readonly distanceKm:number;readonly rating:number|null;readonly reviewCount:number;readonly amenities:readonly string[];readonly verified:boolean}
export interface ParkingSearchCriteria{readonly location:string;readonly startAt:string;readonly endAt:string;readonly vehicleType:VehicleType}
export interface PageResponse<T>{readonly content:readonly T[];readonly page:number;readonly size:number;readonly totalElements:number;readonly totalPages:number}
export interface ApiProblem{readonly type?:string;readonly title:string;readonly status:number;readonly detail?:string;readonly instance?:string;readonly traceId?:string}