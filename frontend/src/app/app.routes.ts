import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page.component';
import { DiscoverPageComponent } from './features/discover-page.component';
import { SignInPageComponent } from './features/sign-in-page.component';
import { WorkspacePageComponent } from './features/workspace-page.component';
export const routes:Routes=[{path:'',component:LandingPageComponent,title:'Parking Assist'},{path:'discover',component:DiscoverPageComponent,title:'Discover parking'},{path:'sign-in',component:SignInPageComponent,title:'Sign in'},{path:'workspace/:role',component:WorkspacePageComponent,title:'Workspace'},{path:'**',redirectTo:''}];