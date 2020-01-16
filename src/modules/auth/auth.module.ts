/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:46:43
 * @LastEditTime: 2019-11-07 11:46:10
 * @LastEditors: Please set LastEditors
 */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET_KEY } from '@app/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../user/user.module'
import { AuthMiddleware } from './auth.middleware'

/**
 * 拦截所有Post、Delete、Put请求，其他请求直接通行
 * @export
 * @class AuthModule
 * @implements {NestModule}
 */
@Module({
    imports: [
        JwtModule.register({
            secretOrPrivateKey: JWT_SECRET_KEY,
            signOptions: {
                expiresIn: '72h',
            },
            verifyOptions: {
                ignoreExpiration: false
            }
        }),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply(AuthMiddleware)
        .forRoutes({ path: '*', method:  RequestMethod.POST }, { path: '*', method:  RequestMethod.DELETE }, { path: '*', method:  RequestMethod.PUT }, { path: '*', method:  RequestMethod.PATCH })
    }
}