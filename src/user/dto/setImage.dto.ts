import { IsString } from 'class-validator';

export class SetImageDto {
  @IsString()
  imageUrl: string;
}
