/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:07:28
 * @LastEditTime: 2019-09-02 18:58:00
 * @LastEditors: Please set LastEditors
 */
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { User } from './user.model'

@Module({
    imports: [TypegooseModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}