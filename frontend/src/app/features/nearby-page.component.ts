import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface DeviceCoordinates { readonly latitude:number; readonly longitude:number; readonly accuracyMeters:number }
type LocationState='idle'|'locating'|'ready'|'error';

/** GPS-first discovery. Inventory is deliberately not mocked while the geospatial API is pending. */
@Component({
 selector:'pa-nearby', standalone:true, imports:[FormsModule,RouterLink],
 template:`
 <section class="nearby"><div class="page">
  <div class="crumb"><a routerLink="/">Home</a><span>/</span><b>Nearby parking</b></div>
  <header class="hero"><div><span class="eyebrow">PARKING AROUND YOU</span><h1>Find a spot <em>nearby.</em></h1><p>Discover parking close to your current location. Your location is shared only after you choose to allow it.</p></div><div class="hero-mark">⌖</div></header>
  <section class="card location">
   <div class="location-copy"><span class="location-icon">◎</span><div><h2>Start with your location</h2><p>Allow location access to prepare a radius-based search, sorted by distance.</p></div></div>
   <button class="btn primary" type="button" (click)="locate()" [disabled]="locationState()==='locating'">{{locationState()==='locating'?'Finding you…':'Use my current location →'}}</button>
   @if(locationState()==='error'){<div class="notice error" role="alert">{{locationError()}}</div>}
   @if(locationState()==='ready' && coordinates(); as point){<div class="notice success" role="status"><b>Location captured</b><span>{{point.latitude.toFixed(5)}}, {{point.longitude.toFixed(5)}} · accuracy about {{Math.round(point.accuracyMeters)}} m</span><small>Coordinates are ready. Verified nearby inventory will load when the parking search API is connected.</small></div>}
  </section>
  <section class="card preferences"><div class="section-head"><div><span class="eyebrow">YOUR SEARCH</span><h2>Set your preferences</h2></div><span class="sort">Distance · nearest first</span></div>
   <div class="fields">
    <label class="field">Search radius<select name="radius" [(ngModel)]="radiusKm"><option [ngValue]="1">Within 1 km</option><option [ngValue]="3">Within 3 km</option><option [ngValue]="5">Within 5 km</option><option [ngValue]="10">Within 10 km</option><option [ngValue]="20">Within 20 km</option></select></label>
    <label class="field">Vehicle type<select name="vehicle" [(ngModel)]="vehicleType"><option value="FOUR_WHEELER">Car</option><option value="TWO_WHEELER">Two-wheeler</option></select></label>
    <label class="field">Parking type<select name="kind" [(ngModel)]="parkingKind"><option value="ALL">All eligible parking</option><option value="PRIVATE">Private spaces</option><option value="PUBLIC_AUTHORIZED">Authorized public</option></select></label>
   </div><p class="helper">Results will include verified private listings and officially authorized public facilities only.</p>
  </section>
  <div class="columns">
   <section class="card results"><div class="section-head"><div><h2>Parking near you</h2><p>Closest eligible spaces will appear first.</p></div><span class="count">0 results</span></div>
    <div class="empty"><span class="empty-icon">⌖</span><h3>Ready to find your nearest spot?</h3><p>Share your location to prepare a nearby search. We won't display made-up spaces or availability.</p><button class="btn outline" type="button" (click)="locate()" [disabled]="locationState()==='locating'">Use my location</button><a routerLink="/discover">Prefer a city or area search? Explore destinations →</a></div>
   </section>
   <aside class="card map"><div class="map-head"><b>Map view</b><span>Map integration pending</span></div><div class="map-canvas"><div class="map-lines"></div><div class="map-pin"><b>◎</b><small>Your location</small></div><p>Map and verified parking pins will appear here</p></div><div class="legend"><span><i class="user-dot"></i>Your location</span><span><i class="space-dot"></i>Verified parking</span></div></aside>
  </div>
  <div class="privacy"><b>⌑</b><p><strong>Your location stays in your control.</strong> The browser asks permission before sharing it. You can deny access and continue with destination search.</p></div>
 </div></section>`,
 styles:[`
 .nearby{padding:32px 0;background:#f7f9f8;min-height:70vh}.crumb{display:flex;gap:10px;font-size:12px;color:#8995a4;margin-bottom:25px}.crumb a{color:#647286}.crumb b{color:#263548}.hero{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.eyebrow{font-size:10px;letter-spacing:1.5px;font-weight:800;color:#176b55}.hero h1{font:800 clamp(34px,4vw,48px) Manrope;letter-spacing:-1.8px;margin:8px 0}.hero h1 em{font-style:normal;color:#176b55}.hero p{max-width:610px;color:#718096;line-height:1.7;margin:0;font-size:14px}.hero-mark{width:72px;height:72px;border-radius:20px;background:#e5f1ea;color:#176b55;display:grid;place-items:center;font-size:40px}
 .card{background:white;border:1px solid #e8eeea;border-radius:16px;box-shadow:0 8px 28px #173a2910}.location{padding:21px;display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}.location-copy{display:flex;gap:14px;align-items:center}.location-icon{width:48px;height:48px;flex:none;border-radius:14px;background:#edf6f0;color:#176b55;display:grid;place-items:center;font-size:27px}.location h2,.preferences h2,.results h2{font:700 18px Manrope;margin:0 0 5px}.location p,.results p{font-size:12px;color:#8190a0;margin:0;line-height:1.6}.notice{grid-column:1/-1;padding:12px 14px;border-radius:10px;display:grid;gap:4px;font-size:12px}.notice.success{background:#edf7f0;color:#245b40}.notice.error{background:#fff1ef;color:#a33b30}.notice small{opacity:.8}
 .preferences{padding:21px;margin-top:15px}.section-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.sort{font-size:11px;color:#176b55;background:#edf6f0;border-radius:20px;padding:7px 11px}.fields{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.field{display:grid;gap:7px;font-size:12px;font-weight:700;color:#506176}.field select{height:43px;border:1px solid #dce5df;border-radius:9px;background:white;padding:0 12px;color:#263548;font:13px inherit}.helper{font-size:11px;color:#8995a4;margin:13px 0 0}
 .columns{display:grid;grid-template-columns:1.15fr .85fr;gap:15px;margin-top:15px}.results,.map{padding:20px}.count{font-size:11px;color:#8190a0;background:#f1f4f2;padding:7px 10px;border-radius:20px}.empty{min-height:285px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:22px}.empty-icon{width:52px;height:52px;background:#edf6f0;color:#176b55;border-radius:17px;display:grid;place-items:center;font-size:29px}.empty h3{font:700 17px Manrope;margin:15px 0 7px}.empty p{max-width:350px;margin:0 0 15px;line-height:1.7}.empty a{font-size:11px;color:#176b55;font-weight:700;margin-top:14px}.map-head{display:flex;justify-content:space-between;font-size:13px}.map-head span{font-size:10px;color:#8995a4}.map-canvas{height:285px;margin-top:14px;border-radius:12px;position:relative;overflow:hidden;background:#eaf0e9;display:grid;place-items:center}.map-lines{position:absolute;inset:-20%;opacity:.7;background:linear-gradient(30deg,transparent 47%,#cbd9ce 48%,#cbd9ce 50%,transparent 51%),linear-gradient(120deg,transparent 47%,#cbd9ce 48%,#cbd9ce 50%,transparent 51%);background-size:75px 75px;transform:rotate(-8deg)}.map-pin{z-index:1;display:grid;justify-items:center;gap:5px;color:#176b55}.map-pin b{width:40px;height:40px;border-radius:50%;background:#176b55;color:white;display:grid;place-items:center;font-size:24px;box-shadow:0 0 0 9px #176b5520}.map-pin small{background:white;border-radius:5px;padding:4px 7px;font-size:10px}.map-canvas>p{position:absolute;bottom:10px;background:#ffffffd9;padding:7px 10px;border-radius:7px;font-size:10px;color:#718096}.legend{display:flex;gap:18px;margin-top:12px;font-size:10px;color:#718096}.legend span{display:flex;align-items:center;gap:6px}.legend i{width:8px;height:8px;border-radius:50%;display:inline-block}.user-dot{background:#176b55}.space-dot{background:#c2c9c4}.privacy{display:flex;gap:10px;align-items:center;margin:17px 0;color:#718096}.privacy>b{font-size:20px;color:#176b55}.privacy p{font-size:11px;line-height:1.6;margin:0}.privacy strong{color:#40536a}
 @media(max-width:800px){.columns{grid-template-columns:1fr}.map{order:-1}.map-canvas{height:220px}}@media(max-width:600px){.nearby{padding-top:23px}.hero-mark{display:none}.location{grid-template-columns:1fr;padding:16px}.location .btn{width:100%}.preferences,.results,.map{padding:16px}.fields{grid-template-columns:1fr}.section-head{align-items:flex-start;gap:10px;flex-direction:column}}
 `]
})
export class NearbyPageComponent {
 readonly Math=Math;
 readonly locationState=signal<LocationState>('idle');
 readonly coordinates=signal<DeviceCoordinates|null>(null);
 readonly locationError=signal('');
 radiusKm=5; vehicleType='FOUR_WHEELER'; parkingKind='ALL';
 locate():void {
  this.locationError.set(''); this.coordinates.set(null);
  if(!('geolocation' in navigator)){this.locationState.set('error');this.locationError.set('Location services are unavailable in this browser. Search by city or area instead.');return;}
  this.locationState.set('locating');
  navigator.geolocation.getCurrentPosition(position=>{
   this.coordinates.set({latitude:position.coords.latitude,longitude:position.coords.longitude,accuracyMeters:position.coords.accuracy});
   this.locationState.set('ready');
  },error=>{
   this.locationState.set('error');
   if(error.code===error.PERMISSION_DENIED)this.locationError.set('Location permission was denied. Allow it in browser site settings, or use destination search instead.');
   else if(error.code===error.POSITION_UNAVAILABLE)this.locationError.set('Your device could not determine a location. Check device location services and try again.');
   else this.locationError.set('Location request timed out. Please try again or search by destination.');
  },{enableHighAccuracy:true,timeout:12000,maximumAge:30000});
 }
}