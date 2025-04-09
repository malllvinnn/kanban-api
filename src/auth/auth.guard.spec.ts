import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let reflector: Reflector;

  type HeaderAuthType = {
    headers: { authorization: string };
    authenticateUser?: {
      id: string;
      name: string;
      email: string;
    };
  };

  const funContext = (
    isSwitch: boolean = false,
    headerAuth?: HeaderAuthType,
  ) => {
    const context = isSwitch
      ? ({
          switchToHttp: () => ({
            getRequest: () => headerAuth,
          }),
          getHandler: jest.fn(),
          getClass: jest.fn(),
        } as unknown as ExecutionContext)
      : ({
          getHandler: jest.fn(),
          getClass: jest.fn(),
        } as unknown as ExecutionContext);

    return context;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            verifyToken: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(false),
          },
        },
        AuthGuard,
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    authService = module.get<AuthService>(AuthService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(authService).toBeDefined();
    expect(reflector).toBeDefined();
  });

  it('should allow request if @SkipAuth is active', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(funContext());

    expect(result).toBe(true);
  });

  it('should throw if Authorization type is not Bearer or Refresh', async () => {
    const result = guard.canActivate(
      funContext(true, {
        headers: {
          authorization: 'Basic abcd',
        },
      }),
    );

    await expect(result).rejects.toThrow(
      new UnauthorizedException('unexpected token kind'),
    );
  });

  it('should throw if token is missing after Bearer or Refresh type', async () => {
    const result = guard.canActivate(
      funContext(true, {
        headers: {
          authorization: 'Bearer',
        },
      }),
    );

    await expect(result).rejects.toThrow(
      new UnauthorizedException('missing token'),
    );
  });

  it('should throw if verifyToken fails', async () => {
    (authService.verifyToken as jest.Mock).mockRejectedValue(
      new Error('invalid'),
    );

    const result = guard.canActivate(
      funContext(true, {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      }),
    );

    await expect(result).rejects.toThrow(UnauthorizedException);
  });

  it('should inject authenticateUser and return true if token is valid', async () => {
    (authService.verifyToken as jest.Mock).mockResolvedValue({
      id: 'format-UUID',
      name: 'Man Cung',
      email: 'mancung@example.com',
    });

    const mockRequest: HeaderAuthType = {
      headers: { authorization: 'Bearer valid-token' },
    };

    const result = await guard.canActivate(funContext(true, mockRequest));

    expect(result).toBe(true);
    expect(mockRequest.authenticateUser).toEqual({
      id: 'format-UUID',
      name: 'Man Cung',
      email: 'mancung@example.com',
    });
  });
});
