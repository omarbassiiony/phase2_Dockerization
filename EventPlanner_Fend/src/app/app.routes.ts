import { Routes } from '@angular/router';
import { Login } from './UserManagement/login/login';
import { SignUp } from './UserManagement/sign-up/sign-up';
import { HomePage } from './HomePage/home-page';
import { EventCreate } from './EventManagement/event-create/event-create';
import { MyEvents } from './EventManagement/my-events/my-events';
import { InvitedEvents } from './EventManagement/invited-events/invited-events';
import { AllEvents } from './EventManagement/all-events/all-events';



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login},
    { path: 'signup', component: SignUp},
    { path: 'home', component: HomePage },
    { path: 'events/create', component: EventCreate },
    { path: 'events/my-events', component: MyEvents }, 
    { path: 'events/invited', component: InvitedEvents }, 
    { path: 'events/all', component: AllEvents },
];
