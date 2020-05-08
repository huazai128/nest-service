/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-28 14:04:56
 * @LastEditTime: 2020-04-30 18:28:21
 * @LastEditors: Please set LastEditors
 */
import { CacheInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
/**
 * 重写缓存拦截器，
 * @export
 * @class HttpCacheInterceptor
 * @extends {CacheInterceptor}
 */
@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    /**
     *
     * @param {ExecutionContext} context
     * @returns {(string | undefined)}
     * @memberof HttpCacheInterceptor
     */
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest()
        const httpServer = this.httpAdapterHost.httpAdapter
        const isGetRequest = httpServer.getRequestMethod(request) === 'GET'
        const excludePaths = []
        if (
          !isGetRequest ||
          (isGetRequest && excludePaths.includes(httpServer.getRequestUrl))
        ) {
          return undefined
        }
        return httpServer.getRequestUrl(request)
    }
}