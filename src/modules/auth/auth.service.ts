/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:46:55
 * @LastEditTime: 2021-01-07 17:04:19
 * @LastEditors: Please set LastEditors
 */
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '@app/modules/user/user.service'
import ServiceExt from '@app/utils/serviceExt'
import { cryptoData } from '@app/utils/common'
import logger from '@app/utils/logger'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './auth.interface'

@Injectable()
export class AuthService extends ServiceExt {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
        super()
    }

    // 创建token
    createToke(account: string) {
        const user: JwtPayload = { account }
        return  this.jwtService.sign(user)
    }

    /**
     * 登录
     * @param loginDto 登录信息
     */
    async login(loginDto: LoginDto) {
        const { password, account } = loginDto
        if (!password || !account) {
            logger.error('账号或密码不能为空', loginDto)
            return { msg: '账号或密码不能为空' }
        }
        const user = await this.userService.findUserByAccount(account)
        if (!user) {
            return { msg: '用户不存在' }
        }
        if (user.password !== cryptoData(password)) {
            return { msg: '密码错误' }
        }
        logger.info(loginDto)
        return {
            account: user.account,
            // category: user.category,
            token: this.createToke(account),
        }
    }

    /**
     * 验证用户是否存在
     * @param account 账号
     */
    async validateUser(account: string) {
        return await this.userService.findUserByAccount(account)
    }
}