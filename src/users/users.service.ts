import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserCreatedDto } from 'src/users/dto/user-created.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/token.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserCreatedDto> {
    const salt = await bcrypt.genSalt(10);
    const hashingPass = await bcrypt.hash(createUserDto.password, salt);
    const timestamps = Date.now();
    const usr = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash: hashingPass,
      isDeleted: false,
      createAt: timestamps,
      updateAt: timestamps,
    });

    const userSaved = await this.userRepository.save(usr);
    return Object.assign(new UserCreatedDto(), {
      name: userSaved.name,
      email: userSaved.email,
    });
  }

  async login(loginDto: LoginDto): Promise<TokenDto | null> {
    const usr = await this.userRepository.findOneBy({
      email: loginDto.email,
      isDeleted: false,
    });
    if (!usr) return null;

    const matched = await bcrypt.compare(loginDto.password, usr.passwordHash);
    if (!matched) return null;

    const isGenToken = this.authService.genToken(usr);

    return isGenToken;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
}
