import { Request } from 'express';
import { UserLoggedDto } from 'src/users/dto/user-logged.dto';

export interface AuthRequest extends Request {
  authenticateUser: UserLoggedDto;
}
