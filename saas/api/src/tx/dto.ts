import { IsIn, IsInt, IsNotEmpty, IsString, Matches, MaxLength, Min } from 'class-validator';

export class CreateTxDto {
  @IsString() @IsNotEmpty() @MaxLength(60) title: string;
  @IsInt() @Min(1) amount: number;
  @IsString() @IsNotEmpty() cat: string;
  @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/) date: string;
  @IsIn(['in','out']) type: 'in'|'out';
}
