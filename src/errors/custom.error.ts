/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 14:03:22
 * @LastEditTime: 2019-10-28 10:44:18
 * @LastEditors: Please set LastEditors
 */
import { HttpException, HttpStatus } from '@nestjs/common'
import { TExceptionOption } from '@app/interfaces/http.interface'

/**
 * 服务端 500
 * @export
 * @class HttpCustomError
 * @extends {HttpException}
 */
export class HttpCustomError extends HttpException {
    constructor(options: TExceptionOption, statusCode?: HttpStatus) {
        super(options, statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
    }
}