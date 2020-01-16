/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:47:05
 * @LastEditTime: 2019-11-07 11:48:32
 * @LastEditors: Please set LastEditors
 */
import { Controller, Post, Body } from '@nestjs/common'
import {  AuthService} from './auth.service'
import { LoginDto } from './dto/login.dto'
import { HttpProcessor } from '@app/decorators/http.decorator'

@Controller('auth')
export class AuthController {
    constructor(private readonly authSerivce: AuthService) {

    }
    @Post('login')
    @HttpProcessor.handle('登录')
    login(@Body() body: LoginDto) {
        console.log(body, '=========')
        return this.authSerivce.login(body)
    }
}