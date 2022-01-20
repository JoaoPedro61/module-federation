import { Controller, Get, Param } from '@nestjs/common';

import { AppService, MicroFrontends } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/available/:applicationName')
  getAvailableMicroFrontends(
    @Param('applicationName') applicationName: string,
  ): MicroFrontends {
    return this.appService.getAvailableMicroFrontends(applicationName);
  }
}
