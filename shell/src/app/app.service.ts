import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface MicroFrontend {
  name: string;
  pathName: string;
  urlEntry: string;
  exposedModule: string;
  applicationType: string;
  ngModule: string;
}

export type MicroFrontends = MicroFrontend[];

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public microfrontends!: MicroFrontends;

  constructor(private router: Router, private readonly http: HttpClient) { }

  public initialise(): Promise<void> {
    return new Promise<void>((resolve) => {

      this.loadConfig()
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.microfrontends = response;
            const ROUTE_CONFIG = this.router.config;
            const NEW_ROUTES: Routes = response.map((micro) => {
              const forRootConfig = {
                ...micro,
                envelopedByShell: true,
              };

              return {
                path: micro.pathName,
                loadChildren: () => loadRemoteModule({
                  type: 'module',
                  remoteEntry: micro.urlEntry,
                  exposedModule: micro.exposedModule,
                }).then(m => {
                  const ngModuleName = (micro.ngModule || micro.exposedModule);

                  return typeof m[ngModuleName].forRoot === 'function'
                    ? m[ngModuleName].forRoot(forRootConfig)
                    : m[ngModuleName]
                })
              };
            });
            if (ROUTE_CONFIG[0] && ROUTE_CONFIG[0].path === '') {
              if (!ROUTE_CONFIG[0].children) {
                ROUTE_CONFIG[0].children = [];
              }
              ROUTE_CONFIG[0].children.push(...NEW_ROUTES);
            } else {
              ROUTE_CONFIG.push(...NEW_ROUTES);
            }
            this.router.resetConfig(ROUTE_CONFIG);
            resolve();
          },
          error: () => {
            resolve();
          }
        });
    });
  }

  public loadConfig(): Observable<MicroFrontends> {
    return this.http
      .get<MicroFrontends>(environment.api.urlMicroFrontends)
      .pipe(take(1));
  }

}

export function initializeApp(mfService: AppService): () => Promise<void> {
  return () => mfService.initialise();
}
