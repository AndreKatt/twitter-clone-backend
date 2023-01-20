export class CreateUserDto {
  email: string;
  username: string;
  fullname: string;
  password: string;
  confirm_hash: string;
}
