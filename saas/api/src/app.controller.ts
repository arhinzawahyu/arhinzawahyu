import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get() hello() { return { name: 'BukuKas API', health: 'ok' }; }
  @Get('health') health() { return this.appService.health(); }
}
