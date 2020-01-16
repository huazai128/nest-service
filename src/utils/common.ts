import * as crypto from 'crypto'
import { Model } from 'mongoose'

/**
 * 加密
 * @param password 密码
 */
export const cryptoData =  (password: string): string => {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
}

/**
 * 根据条件检查数据库中是否已存在该数据
 * @param model 集合
 * @param conditions 参数
 */
export const isDocumentExist = async (model: Model<any>, conditions: { [key: string]: any }) =>  {
    try {
        const count = await model.countDocuments(conditions)
        return count > 0
    } catch (err) {
        throw err
    }
}

export interface ResData {
    data: any
    msg: string
    errCode: number
}

/**
 * 请求返回状态码
 */
const statusCode = {
    10001: '用户或者密码错误',
    10002: '用户已存在',
    10003: '账号或密码不能为空',
    200: '请求成功',
    201: '新建或修改数据成功',
    202: '一个请求已经进入后台排队（异步任务）',
    204: '删除数据成功。',
    400: '错误请求,请求参数有误!',
    401: '用户没有权限（令牌、用户名、密码错误）',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '请求错误,未找到该资源',
    405: '请求方法未允许',
    406: '请求的格式不可得。',
    408: '请求超时',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器',
    502: '网关错误',
    501: '网络未实现',
    503: '服务不可用，服务器暂时过载或维护',
    504: '网关超时',
    505: 'http版本不支持该请求',
}

export interface HandleMode {
    code: number
    data: any
    msg?: string
}
/**
 * 处理请求返回
 */
export const handleReturn = (data: HandleMode): HandleMode => {
    const msg = data.msg || statusCode[data.code]
    return { ...data , msg}
}
