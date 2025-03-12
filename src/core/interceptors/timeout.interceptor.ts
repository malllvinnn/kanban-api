import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      timeout({ each: 5000 }),
      catchError((err: Error) => this.handleFailure(err)),
    );
  }

  handleFailure(err: Error) {
    return throwError(() => {
      if (err instanceof TimeoutError) {
        throw new RequestTimeoutException();
      }
      rethrow(err);
    });
  }
}
