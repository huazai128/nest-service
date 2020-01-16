/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-12 15:02:16
 * @LastEditTime: 2019-09-16 17:49:20
 * @LastEditors: Please set LastEditors
 */
import { Module } from '@nestjs/common'
import { ExpansionController } from './expansion.controller'

@Module({
    imports: [],
    providers: [],
    controllers: [ExpansionController],
    exports: []
})
export class ExpansionModule {}
