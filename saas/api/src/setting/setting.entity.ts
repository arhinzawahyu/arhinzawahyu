import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('setting')
export class Setting {
  @PrimaryColumn() key: string;
  @Column() value: string;
}
