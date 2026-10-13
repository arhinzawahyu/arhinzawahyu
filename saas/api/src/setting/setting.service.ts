import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  constructor(@InjectRepository(Setting) private repo: Repository<Setting>) {}
  async getSaldoAwal() {
    const r = await this.repo.findOne({ where: { key: 'saldoAwal' } });
    return { saldoAwal: Number(r?.value ?? 0) };
  }
  async setSaldoAwal(saldoAwal: number) {
    await this.repo.save({ key: 'saldoAwal', value: String(saldoAwal) });
    return { saldoAwal };
  }
  async getSummary(txRepo: Repository<any>) {
    const { saldoAwal } = await this.getSaldoAwal();
    const rows: any[] = await txRepo.query(`SELECT type, COALESCE(SUM(amount),0) as s FROM tx GROUP BY type`);
    let sumIn=0,sumOut=0; for(const r of rows) r.type==='in'?sumIn=Number(r.s):sumOut=Number(r.s);
    return { saldoAwal, sumIn, sumOut, saldo: saldoAwal + sumIn - sumOut };
  }
}
