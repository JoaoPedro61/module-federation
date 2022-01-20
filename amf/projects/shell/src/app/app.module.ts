import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppService, initializeApp } from './app.service';
import ROUTES from './routes';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { relativeLinkResolution: 'legacy' }),
    HttpClientModule,
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
  bootstrap: [
    AppComponent,
  ]
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
