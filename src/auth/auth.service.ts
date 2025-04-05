import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async genToken(usr: User): Promise<TokenDto> {
    const payload = {
      jwtid: randomUUID,
      sub: usr.id,
      email: usr.email,
    };

    const tokenPayload = await this.jwtService.signAsync(payload);

    return {
      kind: 'Bearer',
      token: tokenPayload,
    };
  }
}
