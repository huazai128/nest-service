/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-18 13:54:58
 * @LastEditTime: 2019-10-24 14:42:33
 * @LastEditors: Please set LastEditors
 */
// 响应
export enum EHttpStatus {
    Error = 'error',
    Success = 'success',
}

export type TMessage = string
export type TExceptionOption = TMessage | {
  message: TMessage
  error?: any
}

// 翻页数据
export interface IHttpResultPaginate<T> {
    data: T
    params: any
    pagination: {
        total: number
        current_page: number
        total_page: number
        per_page: number
    }
}

// 请求返回结果
export interface IHttpResult <T> {
    result: IHttpResultPaginate<T> | T
    code: string | number
    msg?: string
    [key: string]: any
}

// HTTP 状态返回
export interface IHttpResponseBase {
    code: string | number
    msg: TMessage
}

// HTTP error
export type THttpErrorResponse = IHttpResponseBase & {
    error: any
    debug?: string
}

// HTTP success 返回
export type THttpSuccessResponse<T> = IHttpResponseBase & {
    result: T | IHttpResultPaginate<T>;
}

// HTTP Response
export type THttpResponse<T> = THttpErrorResponse | THttpSuccessResponse<T>
