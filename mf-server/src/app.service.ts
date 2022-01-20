import { Injectable } from '@nestjs/common';

export interface MicroFrontend {
  name: string;
  pathName: string;
  urlEntry: string;
  exposedModule: string;
  applicationType: string;
}

export type MicroFrontends = MicroFrontend[];

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public getAvailableMicroFrontends(): MicroFrontends {
    return [
      {
        name: 'auth',
        pathName: 'auth',
        urlEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: 'AuthModule',
        applicationType: 'angular',
      },
    ];
  }
}
