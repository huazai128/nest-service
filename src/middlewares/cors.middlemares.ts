import { Injectable, NestMiddleware, RequestMethod, HttpStatus } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

/**
 * 跨域以及请求头配置
 * 中间件是一个在路由处理器之前被调用的函数
 * 中间件函数可以访问请求和响应对象
 * @export
 * @class CorsMiddlemares
 * @implements {NestMiddleware}
 */
@Injectable()
export class CorsMiddlemares implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const getMethod = (method) => RequestMethod[method]
        const origins = req.headers.origin
        const origin = (Array.isArray(origins) ? origins[0] : origins) || ''
        // 请求方法
        const allowedMethods = [ RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.HEAD, RequestMethod.OPTIONS ]
        // 请求头
        const allowedHeaders = [ 'Authorization', 'Origin', 'No-Cache', 'X-Requested-With', 'If-Modified-Since', 'Pragma', 'Last-Modified', 'Cache-Control', 'Expires', 'Content-Type', 'X-E4M-With' ]
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', allowedHeaders.join(','))
        res.header('Access-Control-Allow-Methods',  allowedMethods.map(getMethod).join(','))
        res.header('Access-Control-Max-Age', '1728000')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.header('X-Powered-By', `Nest 1.1.0`)
        if (req.method === getMethod(RequestMethod.OPTIONS)) {
            return res.sendStatus(HttpStatus.NO_CONTENT)
        } else {
            return next()
        }
    }
}