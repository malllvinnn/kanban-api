import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_SECRET } from 'src/auth/constants/constants';

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
  providers: [AuthService],
})
export class AuthModule {}
