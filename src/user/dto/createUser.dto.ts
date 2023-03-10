import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @Type(() => Types.ObjectId)
  userId: string;

  @MaxLength(40, { message: 'Допустимое количество символов от 10 до 40.' })
  @MinLength(10, { message: 'Допустимое количество символов от 10 до 40.' })
  @IsEmail()
  email: string;

  @MinLength(2, { message: 'Имя должно включать хотя бы 2 символа.' })
  @MaxLength(30, { message: 'Имя должно быть не длиннее 30 символов.' })
  @IsString()
  username: string;

  @MinLength(2, { message: 'Логин должен включать хотя бы 2 символа.' })
  @MaxLength(30, { message: 'Логин должен быть не длиннее 30 символов.' })
  @IsString()
  fullname: string;

  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  @IsString()
  password: string;

  @MinLength(6)
  @IsString()
  password2: string;

  @IsOptional()
  @IsBoolean()
  confirmed: boolean;
}
