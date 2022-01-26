import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { startsWith } from './router.utils';
import { DefaultWrapperComponent } from './wrappers/default-wrapper';

export interface MicroFrontend {
  name: string;
  pathName: string;
  remoteEntry: string;
  exposedModule: string;
  applicationType: string;
  ngModule: string;
  elementName?: string;
}

export type MicroFrontendLoaderCallback = () => Promise<any>;

export interface MicroFrontendLoader {
  [x: string]: MicroFrontendLoaderCallback;
}

export type MicroFrontendList = MicroFrontend[];

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public microFrontendList!: MicroFrontendList;

  private microFrontendLoader: MicroFrontendLoader = {};

  constructor(private router: Router, private readonly http: HttpClient) { }

  public getLoader(name: string): MicroFrontendLoaderCallback | void {
    return this.microFrontendLoader[name] || void 0;
  }

  public initialize(): Promise<void> {
    return new Promise<void>((resolve) => {

      this.loadConfig()
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.microFrontendList = response;
            const ROUTE_CONFIG = this.router.config;
            const NEW_ROUTES: Routes = response.map((micro) => {
              this.microFrontendLoader[micro.name] = () => loadRemoteModule({
                type: 'module',
                remoteEntry: micro.remoteEntry,
                exposedModule: micro.exposedModule,
              });

              // const loader = this.microFrontendLoader[micro.name];

              // const forRootConfig = {
              //   ...micro,
              //   envelopedByShell: true,
              // };

              /* return {
                path: micro.pathName,
                loadChildren: () => loader().then(m => {
                  const ngModuleName = (micro.ngModule || micro.exposedModule);

                  return typeof m[ngModuleName].forRoot === 'function'
                    ? m[ngModuleName].forRoot(forRootConfig)
                    : m[ngModuleName]
                })
              }; */


              return {
                matcher: startsWith(micro.pathName),
                component: DefaultWrapperComponent,
                data: {
                  importName: micro.name,
                  elementName: micro.elementName
                },
              };
            }).filter(v => !!v);
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

  public loadConfig(): Observable<MicroFrontendList> {
    return this.http
      .get<MicroFrontendList>(environment.api.urlMicroFrontend)
      .pipe(take(1));
  }

}

export function initializeApp(mfService: AppService): () => Promise<void> {
  return () => mfService.initialize();
}
