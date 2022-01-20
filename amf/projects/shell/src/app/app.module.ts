import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, Routes } from '@angular/router';
import { take } from 'rxjs/operators';

import ROUTES from './routes';

import { AppComponent } from './app.component';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    RouterModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.http
      .get<any[]>('http://localhost:3000/available')
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          const NEW_ROUTES: Routes = response.map((micro) => {
            const forRootConfig = {
              ...micro,
              envelopedByShell: true,
            };

            return {
              path: micro.pathName,
              loadChildren: () => loadRemoteModule({
                remoteEntry: micro.urlEntry,
                remoteName: micro.name,
                exposedModule: micro.exposedModule,
              }).then(m => typeof m[micro.exposedModule].forRoot === 'function' ? m[micro.exposedModule].forRoot(forRootConfig) : m[micro.exposedModule])
            };
          });
          const MERGED_ROUTES = [...ROUTES, ...NEW_ROUTES];
          this.router.resetConfig(MERGED_ROUTES);
        },
      });
  }

}
