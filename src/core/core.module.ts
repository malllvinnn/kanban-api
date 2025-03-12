import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/core/interceptors/response.interceptors';

@Module({
  providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseInterceptor }],
})
export class CoreModule {}
