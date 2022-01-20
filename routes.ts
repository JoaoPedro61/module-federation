import { loadRemoteModule } from '@angular-architects/module-federation';
import { Routes } from '@angular/router';
// declare module 'auth/AuthModule';

const ROUTES: Routes = [
  // {
  //   path: 'auth',
  //   loadChildren: () => import('auth/AuthModule').then(m => m.FlightsModule)
  // }

  // {
  //   path: 'auth',
  //   loadChildren: () =>
  //     loadRemoteModule({
  //       type: 'module',
  //       remoteEntry: 'http://localhost:4201/remoteEntry.js',
  //       exposedModule: 'AuthModule'
  //     })
  //       .then(m => m.AuthModule)
  // },
];

export default ROUTES;
