import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { SKIP_AUTH_KEY } from 'src/core/decorators/skipAuth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipped = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipped) return true;

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    const [kind, token] = request.headers.authorization?.split(' ') ?? ['', ''];

    if (kind.toLowerCase() !== 'bearer')
      throw new UnauthorizedException('unexpected token kind');

    if (!token) throw new UnauthorizedException('missing token');

    try {
      request['authenticateUser'] = await this.authService.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('invalid token', error);
    }

    return true;
  }
}
