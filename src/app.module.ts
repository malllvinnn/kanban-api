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

@Module({
  imports: [
    TasksModule,
    CoreModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'kanban-be',
      password: 'Selaludia1',
      database: 'kanban-be',
      entities: [Task, User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
