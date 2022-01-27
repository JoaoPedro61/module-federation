import { Injectable } from '@nestjs/common';

export interface MicroFrontend {
  name: string;
  pathName?: string;
  remoteEntry: string;
  exposedModule: string;
  applicationType: string;
  ngModule?: string;
  elementName?: string;
}

export type MicroFrontends = MicroFrontend[];

export const DATA: { [x: string]: MicroFrontends } = {
  shell: [
    {
      name: 'auth',
      pathName: 'auth',
      remoteEntry: 'http://localhost:4001/remoteEntry.js',
      exposedModule: './web-components',
      ngModule: 'AuthModule',
      applicationType: 'angular',
      elementName: 'auth-element',
    },
    {
      name: 'basic_dashboard',
      pathName: 'dashboard',
      remoteEntry: 'http://localhost:3003/remoteEntry.js',
      exposedModule: './web-components',
      applicationType: 'react',
      elementName: 'basic-dashboard',
    },
    /*
    {
      name: 'portalSeguros',
      pathName: 'portalSeguros',
      remoteEntry: 'http://localhost:4002/remoteEntry.js',
      exposedModule: './Module',
      ngModule: 'SchematicRenderModule',
      applicationType: 'angular',
    },
    */
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
