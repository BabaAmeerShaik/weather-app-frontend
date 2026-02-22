import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { WeatherSearch } from './components/weather-search/weather-search';

export const routes: Routes = [
  // When the user goes to /login, show the Login component
  { path: 'login', component: Login },
  
  // When the user goes to /weather, show the Weather component
  { path: 'weather', component: WeatherSearch },
  
  // If they just type localhost:4200, automatically redirect them to login
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];