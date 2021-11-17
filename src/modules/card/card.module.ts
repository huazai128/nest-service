/*
 * @Description: 文章
 * @Author: your name
 * @Date: 2019-08-27 22:33:10
 * @LastEditTime: 2019-10-28 11:55:31
 * @LastEditors: Please set LastEditors
 */
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { FabricModule } from '@app/processors/fabric/fabric.module'
import { CardService } from './card.service'
import { CardController } from './card.controller'


@Module({
    imports: [
        FabricModule
    ],
    controllers: [CardController],
    providers: [CardService],
})
export class CardModule {}
