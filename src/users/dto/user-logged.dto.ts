import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class UserLoggedDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  id: string;
}
