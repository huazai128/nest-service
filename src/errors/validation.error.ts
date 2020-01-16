import { HttpException, HttpStatus } from '@nestjs/common'
import { VALIDATION_ERROR_DEFAULT } from '@app/constants/text.constant'

/**
 * 400 参数错误生成器
 * @export
 * @class ValidationError
 * @extends {HttpException}
 */
export class ValidationError extends HttpException {
    constructor(error?: any) {
        super(error || VALIDATION_ERROR_DEFAULT, HttpStatus.BAD_REQUEST)
    }
}