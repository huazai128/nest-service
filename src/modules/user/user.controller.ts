/*
 * @Author: your name
 * @Date: 2019-06-11 15:07:52
 * @LastEditTime: 2020-04-28 22:14:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/user/user.controller.ts
 */
import { Get, Post, Body, Query, Controller, } from '@nestjs/common'
import { UserService } from './user.service'
import CreateDto from './dto/create.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('all')
    getAll() {
        return '获取所有的用户信息'
    }

    @Post()
    create(@Body() body: CreateDto) {
        return this.userService.createUser(body)
    }
}
