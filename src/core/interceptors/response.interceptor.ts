import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';

type ResponseFormat<T> = {
  code: number;
  data: T;
  text: string;
};

type ResponseError = {
  code: number;
  kind: string;
  text: string;
  details?: any;
};

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map(this.handleSuccess(context)),
      catchError((err: Error) => this.handleFailure(err)),
    );
  }

  handleSuccess(context: ExecutionContext): (data: T) => ResponseFormat<T> {
    return (data: T) => {
      const http = context.switchToHttp();
      const code = http.getResponse<Response>().statusCode;
      return {
        code: code,
        data: data,
        text: code >= 400 ? 'failure' : 'success',
      };
    };
  }

  handleFailure(err: Error) {
    return throwError(() => {
      const respError: ResponseError = {
        code: 500,
        kind: err.name,
        text: err.message,
      };
      if (err instanceof HttpException) {
        respError.code = err.getStatus();
        const response = err.getResponse() as {
          message?: string | string[];
        };
        const message = response.message ?? 'Unknown error';
        if (message) {
          respError.details = message;
        }
      }
      throw new HttpException(respError, respError.code);
    });
  }
}
