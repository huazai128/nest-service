import { HttpException, HttpStatus } from '@nestjs/common'
import { HTTP_PARAMS_PERMISSION_ERROR_DEFAULT } from '@app/constants/text.constant'
/**
 * 403 无权限/权限不足
 * @export
 * @class HttpForbiddenError
 * @extends {HttpException}
 */
export class HttpForbiddenError extends HttpException {
    constructor(error: any) {
        super(error || HTTP_PARAMS_PERMISSION_ERROR_DEFAULT, HttpStatus.FORBIDDEN)
    }
}