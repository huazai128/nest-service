/*
 * @Author: your name
 * @Date: 2019-06-26 14:14:02
 * @LastEditTime: 2019-10-24 14:21:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/errors/unauthorized.error.ts
 */
import { HttpException, HttpStatus } from '@nestjs/common'
import { HTTP_UNAUTHORIZED_TEXT_DEFAULT } from '@app/constants/text.constant'
/**
 * 401 未授权/权限验证失败
 * @export
 * @class HttpUnauthorizedError
 * @extends {HttpException}
 */
export class HttpUnauthorizedError extends HttpException {
    constructor(error?: any) {
        super(error || HTTP_UNAUTHORIZED_TEXT_DEFAULT, HttpStatus.UNAUTHORIZED)
    }
}