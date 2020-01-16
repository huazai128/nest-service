/*
 * @Description: 文章
 * @Author: your name
 * @Date: 2019-08-27 22:33:10
 * @LastEditTime: 2019-10-28 11:55:31
 * @LastEditors: Please set LastEditors
 */
import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { Article } from './article.model'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { TagModule } from '@app/modules/tag/tag.module'

@Module({
    imports: [
        TagModule,
        TypegooseModule.forFeature([ Article ])
    ],
    controllers: [ArticleController],
    providers: [ArticleService],
    exports: [ArticleService]
})
export class ArticleModule {}
