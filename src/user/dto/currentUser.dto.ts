import { IsString } from 'class-validator';

export class CurrentUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  fullname: string;
}
