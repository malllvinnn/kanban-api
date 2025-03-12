import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [TasksModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
