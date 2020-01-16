import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { timeout } from 'rxjs/operators'

/**
 * 请求超时拦截器，设置超时1500ms
 * @export
 * @class TimeoutInterceptor
 * @implements {NestInterceptor<any>}
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor<any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(timeout(1500))
    }
}