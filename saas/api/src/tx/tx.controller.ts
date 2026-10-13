import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { TxService } from './tx.service';
import { CreateTxDto } from './dto';

@Controller('tx')
export class TxController {
  constructor(private svc: TxService) {}
  @Get() list(@Query('q') q?: string, @Query('cat') cat?: string) { return this.svc.findAll(q, cat); }
  @Post() create(@Body() dto: CreateTxDto) { return this.svc.create(dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(Number(id)); }
}
