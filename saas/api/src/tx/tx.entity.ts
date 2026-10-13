import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tx')
export class Tx {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column('integer') amount: number;
  @Column() cat: string;
  @Column() date: string; // YYYY-MM-DD
  @Column() type: 'in' | 'out';
  @CreateDateColumn() createdAt: Date;
}
