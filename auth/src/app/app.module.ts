import { APP_INITIALIZER, DoBootstrap, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppService, initializeApp, InitializeAppOptions, initializeAppWithOptions } from './app.service';
import { AppComponent } from './app.component';
import { endsWith } from './router.utils';

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
        matcher: endsWith(''),
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      }
    ]),
  ],
  providers: [
    AppService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [
        AppService,
      ],
    },
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    AppComponent,
  ],
})
export class AppModule implements DoBootstrap {

  public static forRoot(options: InitializeAppOptions): ModuleWithProviders<AppModule> {
    return {
      ngModule: AppModule,
      providers: [
        AppService,
        {
          provide: APP_INITIALIZER,
          useFactory: initializeAppWithOptions({
            ...options,
          }),
          multi: true,
          deps: [
            AppService,
          ],
        },
      ],
    };
  }

  constructor(private readonly injector: Injector) { }

  public ngDoBootstrap(): void {
    const ce = createCustomElement(AppComponent, { injector: this.injector });
    customElements.define('auth-element', ce);
  }

}
