import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_SECRET } from 'src/auth/constants/constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: AUTH_SECRET,
      signOptions: {
        algorithm: 'HS256',
        expiresIn: '1h',
        audience: 'kanban-be',
        issuer: 'kanban-be',
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
