import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './setting.entity';
import { Tx } from '../tx/tx.entity';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({ imports: [TypeOrmModule.forFeature([Setting, Tx])], providers: [SettingService], controllers: [SettingController] })
export class SettingModule {}
