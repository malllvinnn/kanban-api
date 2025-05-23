import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ConflictException,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFailedError } from 'typeorm';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { LoginDto } from 'src/users/dto/login.dto';
import { TokenDto } from 'src/auth/dto/token.dto';
import { SkipAuth } from 'src/core/decorators/skipAuth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (ex) {
      if (ex instanceof QueryFailedError) {
        const codeDriverError = ex.driverError as { code: string };
        if (codeDriverError.code === '23505') {
          throw new ConflictException('email alredy taken');
        } else {
          console.log('unhandle error code', codeDriverError.code);
        }
      }
      rethrow(ex);
    }
  }

  @SkipAuth()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenDto | null> {
    const usr = await this.usersService.login(loginDto);
    if (!usr) throw new UnauthorizedException('email or password invalid');
    return usr;
  }

  @Get('profile')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }
}
