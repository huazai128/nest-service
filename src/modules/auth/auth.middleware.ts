/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-17 18:01:38
 * @LastEditTime: 2019-11-07 11:47:27
 * @LastEditors: Please set LastEditors
 */
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UNNECESSARY_AUTH_ROUTERS, JWT_SECRET_KEY } from '@app/config'
import { HttpForbiddenError } from '@app/errors/forbidden.error'
import { HttpUnauthorizedError } from '@app/errors/unauthorized.error'
import * as jwt from 'jsonwebtoken'
import logger from '@app/utils/logger'
import { JwtPayload } from './auth.interface'
import { AuthService } from './auth.service'

/**
 * 检查是否绕过权限访问
 * @param {string} path
 * @returns {boolean}
 */
function checkRouterNeedsAuth(path: string): boolean {
    const _path: string = (path.startsWith('/api') ? path.slice(4, path.length) : path) || '/'
    for (const router of UNNECESSARY_AUTH_ROUTERS) {
        if (router.exact) {
            if (router.path === _path) {
                return true
            }
        } else if (router.path === _path || router.path.startsWith(`${_path}/`)) {
            return true
        }
    }
    return false
}

/**
 * 权限拦截中间件
 * @export
 * @class AuthMiddleware
 * @implements {NestMiddleware}
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor( private readonly authService: AuthService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const url = req.url.split('?')[0]
        const flag = checkRouterNeedsAuth(url)
        if (flag) {
            return next()
        }
        const { authorization } = req.headers
        const auth = authorization && authorization.split(' ') || []
        console.log(auth, 'auth=========')
        if (!!auth.length && auth[0] === 'Bearer') {
            const token = auth[1]
            try {
                const { account } = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload
                const user = await this.authService.validateUser(account)
                if (user) {
                    return next()
                }
                throw new HttpUnauthorizedError('没有权限')
            } catch (error) {
                logger.error(error)
                throw new HttpForbiddenError(error)
            }
            next()
        } else {
            throw new HttpUnauthorizedError('没有权限')
        }
    }
}