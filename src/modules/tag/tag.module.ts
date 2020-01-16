/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 16:04:51
 * @LastEditTime: 2019-10-25 14:39:03
 * @LastEditors: Please set LastEditors
 */
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { Tag } from './tag.model'
import { TagController } from './tag.controller'
import { TagService } from './tag.service'

@Module({
    imports: [TypegooseModule.forFeature([Tag])],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService]
})
export class TagModule { }