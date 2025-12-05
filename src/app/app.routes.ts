import { Routes } from '@angular/router';
import { InputFormComponent } from './input-form/input-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'inference', pathMatch: 'full' },
    { path: 'inference', component: InputFormComponent}
];
