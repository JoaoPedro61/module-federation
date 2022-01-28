import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

/**
 * This module is a simple wrapper for the AuthModule
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      }
    ]),
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    AppComponent,
  ],
})
export class AppModule { }
