import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const cs = app.get(ConfigService);
  const appConfig = cs.get<AppConfig>('app');
  if (!appConfig) throw new Error('missing appConfig');
  Logger.log(
    `server listening on port ${appConfig.port} at mode ${appConfig.env}`,
  );

  await app.listen(appConfig.port);
}
bootstrap();
