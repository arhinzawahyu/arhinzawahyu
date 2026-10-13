import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tx } from './tx.entity';
import { TxService } from './tx.service';
import { TxController } from './tx.controller';

@Module({ imports: [TypeOrmModule.forFeature([Tx])], providers: [TxService], controllers: [TxController] })
export class TxModule {}
