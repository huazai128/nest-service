/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-18 11:32:08
 * @LastEditTime: 2021-01-07 16:24:39
 * @LastEditors: Please set LastEditors
 */
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { map } from 'rxjs/operators'
import { PaginateResult } from 'mongoose'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { THttpResponse, TMessage, IHttpResultPaginate } from '@app/interfaces/http.interface'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'
/**
 * 处理分页数据
 * @export
 * @template T
 * @param {*} data
 * @param {*} request
 * @returns {IHttpResult<T[]>}
 */
export function handleResult<T>(data: PaginateResult<T>, request: any): IHttpResultPaginate<T[]>  {
    return {
            data: data.docs || [],
            params: request ? request.queryParams : null,
            pagination: {
                total: data.total,
                current_page: data.page,
                total_page: data.pages,
                per_page: data.limit,
            }
        }
}

/**
 * 相应拦截器，拦截返回参数
 * @export
 * @class TransformInterceptor
 * @implements {NestInterceptor<T, THttpResponse<T>>}
 * @template T
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, THttpResponse<T>> {
    constructor( private readonly reflector: Reflector ) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const call$ = next.handle()
        const target = context.getHandler()
        const request = context.switchToHttp().getRequest()
        // 反射器的数据是通过SetMetadata设置值来获取的
        const message = this.reflector.get<TMessage>(META.HTTP_SUCCESS_MESSAGE, target) || TEXT.HTTP_DEFAULT_SUCCESS_TEXT
        const usePaginate = this.reflector.get<boolean>(META.HTTP_RES_TRANSFORM_PAGINATE, target)
        return call$.pipe(
            map((data: any = {}) => {
                const result = !usePaginate ? (data || {}) : handleResult<T>(data, request)
                return data.msg ? { code: 200, ...data } : { result, code: 200, msg: message  }
            })
        )
    }
}