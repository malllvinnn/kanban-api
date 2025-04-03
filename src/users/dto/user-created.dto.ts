import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UserCreatedDto extends OmitType(CreateUserDto, [
  'password',
] as const) {}
