import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { AUTH_SECRET } from 'src/auth/constants/constants';
import { AuthResponded } from 'src/auth/dto/auth-responded.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { UserLoggedDto } from 'src/users/dto/user-logged.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async genToken(usr: User): Promise<TokenDto> {
    const payload = {
      jwtid: randomUUID,
      sub: usr.id,
      name: usr.name,
      email: usr.email,
    };

    const tokenPayload = await this.jwtService.signAsync(payload);

    return {
      kind: 'Bearer',
      token: tokenPayload,
    };
  }

  async verifyToken(token: string): Promise<UserLoggedDto> {
    const payload = await this.jwtService.verifyAsync<AuthResponded>(token, {
      secret: AUTH_SECRET,
      algorithms: ['HS256'],
      audience: 'kanban-be',
      issuer: 'kanban-be',
    });

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
