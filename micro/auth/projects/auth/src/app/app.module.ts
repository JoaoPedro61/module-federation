import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      },
    ]),
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
