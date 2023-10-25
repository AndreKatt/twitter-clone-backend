import { IsString } from 'class-validator';

export class SetAvatarDto {
  @IsString()
  avatarUrl: string;
}
