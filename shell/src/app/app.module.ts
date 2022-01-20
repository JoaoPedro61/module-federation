import { RouterModule } from '@angular/router';
import { ApplicationRef, APP_INITIALIZER, DoBootstrap, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import ROUTES from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { AppService, initializeApp } from './app.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    AppService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AppService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule implements DoBootstrap {

  public ngDoBootstrap(appRef: ApplicationRef): void {
    appRef
      .isStable
      .subscribe({
        next: (isStable) => {
          console.log(`Application is ${!isStable ? 'un' : ''}stable`)
        },
      });
  }

}
