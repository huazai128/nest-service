import { HttpException, HttpStatus } from '@nestjs/common'
import { HTTP_DEFAULT_ERROR_TEXT } from '@app/constants/text.constant'

/**
 * 异常处理 请求异常 400
 * @export
 * @class HttpBadRequestError
 * @extends {HttpException}
 */
export class HttpBadRequestError extends HttpException {
    constructor(error: any) {
        super(error || HTTP_DEFAULT_ERROR_TEXT , HttpStatus.BAD_REQUEST)
    }
}