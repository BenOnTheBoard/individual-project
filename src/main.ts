import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { routes } from './app/routing/app-routing.module';
import { provideRouter } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
