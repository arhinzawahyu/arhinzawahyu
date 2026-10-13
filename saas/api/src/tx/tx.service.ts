import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tx } from './tx.entity';
import { CreateTxDto } from './dto';

@Injectable()
export class TxService {
  constructor(@InjectRepository(Tx) private repo: Repository<Tx>) {}
  findAll(q?: string, cat?: string) {
    const qb = this.repo.createQueryBuilder('tx').orderBy('tx.date','DESC').addOrderBy('tx.id','DESC');
    if (cat) qb.andWhere('tx.cat = :cat', { cat });
    if (q) qb.andWhere('(tx.title LIKE :q OR tx.cat LIKE :q)', { q: `%${q}%` });
    return qb.getMany();
  }
  create(dto: CreateTxDto) { return this.repo.save(this.repo.create(dto)); }
  async remove(id: number) { await this.repo.delete(id); return { ok: true }; }
}
