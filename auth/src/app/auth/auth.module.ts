import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestingCoreEventsModule } from 'testing-core-events';

import { AuthComponent } from './auth.component';


@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    TestingCoreEventsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
      }
    ])
  ]
})
export class AuthModule { }
