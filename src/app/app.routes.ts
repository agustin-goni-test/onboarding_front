import { Routes } from '@angular/router';
import { InputFormComponent } from './input-form/input-form.component';
import { RegistrationComponent } from './registration/registration.component';

export const routes: Routes = [
    { 
        path: '',
        redirectTo: 'registration',
        pathMatch: 'full'
    },
    {
        path: 'registration',
        component: RegistrationComponent
    },
    { 
        path: 'inference', 
        component: InputFormComponent
    }
];
