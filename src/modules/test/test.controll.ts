/*
 * @Author: your name
 * @Date: 2019-10-28 15:51:15
 * @LastEditTime: 2019-10-28 16:28:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/test/test.controll.ts
 */
import { Controller, Get, Post } from '@nestjs/common'
import { TestService } from './test.service'

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) {
    }
    @Get()
    getAll() {
        return '1212'
    }

    @Post()
    create() {
        return  '传销'
    }

}