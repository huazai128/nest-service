/*
 * @Author: your name
 * @Date: 2019-10-28 15:47:56
 * @LastEditTime: 2019-10-28 16:28:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/test/test.module.ts
 */
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { TestService } from './test.service'
import { TestController } from './test.controll'
import { Test } from './test.model'

@Module({
    imports: [TypegooseModule.forFeature([Test])],
    controllers: [TestController],
    providers: [TestService],
    exports: [TestService]
})
export class TestModule {}