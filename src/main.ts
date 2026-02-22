import 'zone.js'; // <--- THIS IS THE MAGIC FIX!

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app'; 

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));