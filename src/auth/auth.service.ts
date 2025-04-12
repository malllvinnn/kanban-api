import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { AuthResponded } from 'src/auth/dto/auth-responded.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { JWTConfig } from 'src/config/config';
import { UserLoggedDto } from 'src/users/dto/user-logged.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly jwtVerifyOption: JwtVerifyOptions;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const jwtConfig = configService.get<JWTConfig>('jwt');

    if (!jwtConfig) throw new Error('JWT config is not defined');

    this.jwtVerifyOption = {
      secret: jwtConfig.secret,
      algorithms: [jwtConfig.algorithm],
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
    };
  }

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
    const payload = await this.jwtService.verifyAsync<AuthResponded>(
      token,
      this.jwtVerifyOption,
    );

    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
