import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { CoreModule } from 'src/core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { UsersModule } from './users/users.module';
import { User } from 'src/users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { DatabaseConfig, JWTConfig } from 'src/config/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TasksModule,
    CoreModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const conf = cs.get<DatabaseConfig>('database');
        return {
          type: 'postgres',
          entities: [Task, User],
          ...conf,
        };
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const conf = cs.get<JWTConfig>('jwt');

        if (!conf) throw new Error('missing JWTConfig');

        return {
          secret: conf.secret,
          signOptions: {
            algorithm: conf.algorithm,
            expiresIn: conf.expires,
            audience: conf.audience,
            issuer: conf.issuer,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
