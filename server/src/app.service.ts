import { Injectable } from '@nestjs/common';

export interface MicroFrontend {
  name: string;
  pathName: string;
  urlEntry: string;
  exposedModule: string;
  applicationType: string;
  ngModule: string;
}

export type MicroFrontends = MicroFrontend[];

export const DATA: { [x: string]: MicroFrontends } = {
  shell: [
    {
      name: 'auth',
      pathName: 'auth',
      urlEntry: 'http://localhost:4001/remoteEntry.js',
      exposedModule: './Module',
      ngModule: 'AuthModule',
      applicationType: 'angular',
    },
    {
      name: 'portalSeguros',
      pathName: 'portalSeguros',
      urlEntry: 'http://localhost:4002/remoteEntry.js',
      exposedModule: './Module',
      ngModule: 'SchematicRenderModule',
      applicationType: 'angular',
    },
  ],
  auth: [],
};

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  public getAvailableMicroFrontends(applicationName = 'shell'): MicroFrontends {
    return DATA[applicationName] || [];
  }
}
