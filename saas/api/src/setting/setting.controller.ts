import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsInt, Min } from 'class-validator';
import { SettingService } from './setting.service';
import { Tx } from '../tx/tx.entity';

class SaldoDto { @IsInt() @Min(0) saldoAwal: number; }

@Controller('setting')
export class SettingController {
  constructor(private svc: SettingService, @InjectRepository(Tx) private txRepo: Repository<Tx>) {}
  @Get('saldo-awal') getSaldoAwal() { return this.svc.getSaldoAwal(); }
  @Post('saldo-awal') setSaldoAwal(@Body() dto: SaldoDto) { return this.svc.setSaldoAwal(dto.saldoAwal); }
  @Get('summary') summary() { return this.svc.getSummary(this.txRepo); }
}
