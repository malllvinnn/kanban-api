import { Request } from 'express';
import { UserLoggedDto } from 'src/users/dto/user-logged.dto';
// import { AuthResponded } from 'src/auth/dto/auth-responded.dto';

export interface AuthRequest extends Request {
  authenticateUser: UserLoggedDto;
}
