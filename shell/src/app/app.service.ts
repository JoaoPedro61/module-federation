import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare const require: any;
const settings = require('../../module.federation.json');

export interface MicroFrontend {
  [x: string]: any;
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

  public microFrontendList: MicroFrontendList = [];

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
          next: (response: any[]) => {
            this.microFrontendList = [];
            const ROUTE_CONFIG = this.router.config;
            let NEW_ROUTES: Routes = [];
            response.forEach((micro: any) => {
              (micro.applications || []).forEach((item: any) => {
                const forRootConfig = {
                  ...micro,
                  envelopedByShell: true,
                };

                this.microFrontendList.push(item);

                NEW_ROUTES.push({
                  path: item.pathName,
                  loadChildren: () => loadRemoteModule({
                    type: 'module',
                    remoteEntry: micro.remoteUrl,
                    exposedModule: item.exposedModule,
                  }).then((m: any) => {
                    const exposedNgModuleName = (item.exposedNgModule || item.exposedModule);
                    const applyConfigNameFn = 'forRoot';

                    return (m[exposedNgModuleName][applyConfigNameFn]) && (typeof m[exposedNgModuleName][applyConfigNameFn] === 'function')
                      ? m[exposedNgModuleName].forRoot(forRootConfig)
                      : m[exposedNgModuleName]
                  })
                });
              })
            });
            NEW_ROUTES = NEW_ROUTES.filter(v => !!v);

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

  public loadConfig(): Observable<any> {
    return this.http
      .get<any>(environment.api.urlMicroFrontend, {
        params: {
          remotes: JSON.stringify(settings.remotes || {}),
        }
      })
      .pipe(take(1));
  }

}

export function initializeApp(mfService: AppService): () => Promise<void> {
  return () => mfService.initialize();
}
