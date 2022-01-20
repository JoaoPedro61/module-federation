import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// import { loadRemoteModule } from './federation-utils';


export interface MicroFrontend {
  name: string;
  pathName: string;
  urlEntry: string;
  exposedModule: string;
  applicationType: string;
}

export type MicroFrontends = MicroFrontend[];


@Injectable({
  providedIn: 'root'
})
export class AppService {

  public microfrontends!: MicroFrontends[];

  constructor(private router: Router, private readonly http: HttpClient) { }

  public initialise(): Promise<void> {
    return new Promise<void>((resolve) => {

      this.loadConfig()
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            const ROUTE_CONFIG = this.router.config;
            const NEW_ROUTES: Routes = response.map((micro) => {
              const forRootConfig = {
                ...micro,
                envelopedByShell: true,
              };

              return {
                path: micro.pathName,
                loadChildren: () => loadRemoteModule({
                  type: 'script',
                  remoteEntry: micro.urlEntry,
                  remoteName: micro.name,
                  exposedModule: micro.exposedModule,
                }).then(m => {
                  return typeof m[micro.exposedModule].forRootasd === 'function'
                    ? m[micro.exposedModule].forRoot(forRootConfig)
                    : m[micro.exposedModule]
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
      .get<MicroFrontends>('http://localhost:3000/available/shell')
      .pipe(take(1));
  }

}

export function initializeApp(mfService: AppService): () => Promise<void> {
  return () => mfService.initialise();
}
