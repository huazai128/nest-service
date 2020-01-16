/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-26 14:23:46
 * @LastEditTime: 2019-08-27 22:27:49
 * @LastEditors: Please set LastEditors
 */
import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common'
import { ValidationError } from '@app/errors/validation.error'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

/**
 * 参数验证，全局过滤参数
 * @export
 * @class ValidationPipe
 * @implements {PipeTransform<any>}
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {
        const { metatype } = metadata
        if (!metatype || !this.toValidate(metatype)) {
            return value
        }
        const object = plainToClass(metatype, value)
        const errors = await validate(object)
        if (errors.length > 0) {
            const errorMessage = errors.map(error => Object.values(error.constraints).join(';')).join(';')
            throw new ValidationError(errorMessage)
        }
        return value
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object]
        return !types.find((type) => metatype === type)
    }
}