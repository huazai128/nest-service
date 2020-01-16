/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-18 11:21:50
 * @LastEditTime: 2019-10-28 18:26:37
 * @LastEditors: Please set LastEditors
 */
import { Observable, throwError } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { catchError } from 'rxjs/operators'
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common'
import { HttpCustomError } from '@app/errors/custom.error'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'
import { TMessage } from '@app/interfaces/http.interface'

/**
 * 错误拦截器
 * @export
 * @class ErrorInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler) {
		const call$ = next.handle()
		const target = context.getHandler()
		const statusCode = this.reflector.get<HttpStatus>(META.HTTP_ERROR_CODE, target)
		const message = this.reflector.get<TMessage>(META.HTTP_ERROR_MESSAGE, target) || TEXT.HTTP_DEFAULT_ERROR_TEXT
		return call$.pipe(
			catchError(error => throwError(new HttpCustomError({ message, error }, statusCode))),
		)
    }
}
