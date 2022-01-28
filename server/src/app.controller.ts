import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { Register, GetRemotes } from './app.service.props';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/register')
  public async register(@Body() data: Register): Promise<Register> {
    return await this.appService.register(data);
  }

  @Get('/get-remotes')
  getRemotes(@Query('remotes') remotes: GetRemotes): any {
    return this.appService.getRemotes(
      typeof remotes === 'string' ? JSON.parse(remotes) : remotes,
    );
  }
}
