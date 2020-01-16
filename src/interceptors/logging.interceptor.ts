import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { isDevMode } from '@app/app.env'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

/**
 * 日志拦截器
 * @export
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const call$ = next.handle()
        if (!isDevMode) {
            return call$
        }
        const request = context.switchToHttp().getRequest()
        const content = request.method + ' -> ' + request.url
        console.log('+++ 收到请求：', content)
        const now = Date.now()
        return call$.pipe(
            tap(() => console.log('--- 响应请求：', content, `${Date.now() - now}ms`)),
        )
    }
}