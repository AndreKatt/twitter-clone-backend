import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
