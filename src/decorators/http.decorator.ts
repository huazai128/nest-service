/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-19 17:26:43
 * @LastEditTime: 2019-10-28 10:39:05
 * @LastEditors: Please set LastEditors
 */
/**
 * 自定义装饰器
 */

import * as lodash from 'lodash'
import { SetMetadata, HttpStatus } from '@nestjs/common'
import { TMessage } from '@app/interfaces/http.interface'
import * as META from '@app/constants/meta.constant'
import * as TEXT from '@app/constants/text.constant'

/**
 * 参数
 * @interface IBuildOptions
 */
interface IBuildOptions {
    errCode?: HttpStatus
    successCode?: HttpStatus
    errMessage?: TMessage
    successMessage?: TMessage
    usePaginate?: boolean
}

// handle 参数
interface IHandleOption {
    error?: HttpStatus
    success?: HttpStatus
    message: TMessage
    usePaginate?: boolean
  }

type THandleOption = TMessage | IHandleOption

/**
 * 请求构造装饰器
 * SetMetadata: 设置元数据
 * @param {IBuildOptions} options
 * @returns {ClassDecorator}：类装饰器
 */
const buildHttpDecorator = (options: IBuildOptions): MethodDecorator => {
    const { errMessage, successMessage, errCode, successCode, usePaginate } = options
    return (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
        if (errCode) {
            SetMetadata(META.HTTP_ERROR_CODE, errCode)(descriptor.value)
        }
        if (successCode) {
            SetMetadata(META.HTTP_SUCCESS_CODE, successCode)(descriptor.value)
        }
        if (errMessage) {
            SetMetadata(META.HTTP_ERROR_MESSAGE, errMessage)(descriptor.value)
        }
        if (successMessage) {
            SetMetadata(META.HTTP_SUCCESS_MESSAGE, successMessage)(descriptor.value)
        }
        if (usePaginate) {
            SetMetadata(META.HTTP_RES_TRANSFORM_PAGINATE, true)(descriptor.value)
        }
        return descriptor
    }
}

/**
 * 方法构造器
 * 用来处理因函数参数不同而返回类型不同的使用场景，使用时，只需为同一个函数定义多个类型即可
 * @export 函数重载
 * @param {*} args
 * @returns {MethodDecorator} 方法装饰器
 */
export function handle(args: THandleOption): MethodDecorator
export function handle(...args): MethodDecorator {
    const option = args[0]
    const isOption = (value: THandleOption): value is IHandleOption => lodash.isObject(value)
    const message: TMessage = isOption(option) ? option.message : option
    const errMessage: TMessage = message + TEXT.HTTP_ERROR_SUFFIX
    const successMessage: TMessage = message + TEXT.HTTP_SUCCESS_SUFFIX
    const errCode: HttpStatus = isOption(option) ? option.error : null
    const successCode: HttpStatus = isOption(option) ? option.success : null
    const usePaginate: boolean = isOption(option) ? option.usePaginate : null
    return buildHttpDecorator({ errCode, successCode, errMessage, successMessage, usePaginate })
}

/**
 * 分页装饰器
 * @export
 * @returns {MethodDecorator}: 方法装饰器
 */
export function paginate(): MethodDecorator {
    return buildHttpDecorator({ usePaginate: true })
}

export const HttpProcessor = { handle, paginate }