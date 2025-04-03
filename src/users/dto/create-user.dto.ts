import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(4, 64)
  password: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}
