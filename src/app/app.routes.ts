import { Routes } from '@angular/router';
import { PinListComponent } from './pins/pin-list/pin-list.component';


export const routes: Routes = [
    { path: '', redirectTo: 'pin-list', pathMatch: 'full' },
    { path: 'pin-list', component: PinListComponent, pathMatch: 'full' },
];
