/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 22:32:52
 * @LastEditTime: 2019-11-07 11:38:35
 * @LastEditors: Please set LastEditors
 */
import * as lodash from 'lodash'
import { PaginateResult } from 'mongoose'
import { ESortType } from '@app/interfaces/state.interface'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { Controller, Get, Post, Body, Put, HttpStatus, Patch, Delete } from '@nestjs/common'
import { QueryParams, EQueryParamsField as QueryField } from '@app/decorators/query-params.decorator'
import { TagService } from '@app/modules/tag/tag.service'
import { ArticleService } from './article.service'
import { Article } from './article.model'
import { http } from 'winston'

type TSluService = (slug: string) => Promise<any>

@Controller('acticle')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly tagService: TagService
    ) {
    }

    @Get()
    @HttpProcessor.paginate()
    @HttpProcessor.handle('获取文章')
    getArticleList(@QueryParams([ QueryField.Date, QueryField.State, QueryField.Public, QueryField.Origin, 'cache', 'tags', 'tag_slug']) { querys, options, origin, isAuthenticated }): Promise<PaginateResult<Article>> {
        // 是否为热门请求
        if (Number(origin.sort) === ESortType.Hot) {
            options.sort = this.articleService.getHotSort()
            if (!isAuthenticated && querys.cache) {
                return this.articleService.getHotArticleLists()
            }
        }
        // 关键词搜索
        const keyword = lodash.trim(origin.keyword)
        if (keyword) {
            const keywordRegExp = new RegExp(keyword, 'i')
            querys.$or = [
                { title: keywordRegExp },
                { content: keywordRegExp },
                { description: keywordRegExp },
            ]
        }
        options.populate = [
            { path: 'tag', select: 'name _id' },
        ]
        return this.articleService.getArticle(querys, options)
    }

    @Post()
    @HttpProcessor.handle('新增文章')
    addArticle(@Body() article: Article) {
        return this.articleService.create(article)
    }

    @Get(':id')
    @HttpProcessor.handle({ message: '获取文章详情', error: HttpStatus.NOT_FOUND })
    getByArticleId(@QueryParams() { params, isAuthenticated }) {
        return isAuthenticated ? this.articleService.findByIdActicle(params.id) : ''
    }

    @Put(':id')
    @HttpProcessor.handle('修改文章')
    modifyArticle(@QueryParams() { params}, @Body() article: Article) {
        return this.articleService.update(params.id, article)
    }

    @Patch()
    @HttpProcessor.handle('批量修改')
    batchEdit(@Body() { ids, state }) {
        return this.articleService.batchModify(ids, state)
    }

    @Delete()
    @HttpProcessor.handle('批量删除')
    batchDelete(@Body() { ids }) {
        console.log(ids, 'ids=======')
        return this.articleService.delete(ids)
    }
}