/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 16:05:00
 * @LastEditTime: 2019-11-06 15:38:09
 * @LastEditors: Please set LastEditors
 */
import * as lodash from 'lodash'
import { Controller, Post, Body, Get, Query, Delete, Param } from '@nestjs/common'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { QueryParams } from '@app/decorators/query-params.decorator'
import { TagService } from './tag.service'
import { Tag, DelTags } from './tag.model'

/**
 * 标签模块控制器
 * @export
 * @class TagController
 */
@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Post()
    @HttpProcessor.handle('保存标签')
    addTag(@Body() body: Tag): Promise<Tag> {
        return this.tagService.create(body)
    }

    @Get('tagId')
    @HttpProcessor.handle('根据字段获取标签')
    async getTag(@Query() query: any) {
        return await this.tagService.getTagInfo(query.slug)
    }

    @Get()
    @HttpProcessor.paginate()
    @HttpProcessor.handle('获取标签')
    async getAllTag(@QueryParams(['cache']) { querys, options, origin }): Promise<Tag[]> {
        const keyword = lodash.trim(origin.keyword)
        if (keyword) {
            const keywordRegExp = new RegExp(keyword, 'i')
            querys.$or = [
                { name: keywordRegExp },
                { slug: keywordRegExp },
                { description: keywordRegExp },
            ]
        }
        return this.tagService.getAllTag(querys, options)
    }

    @Delete()
    @HttpProcessor.handle('批量删除')
    public batchDelTag(@Body() body: DelTags): Promise<any> {
        return this.tagService.batchDelete(body.ids)
    }

    @Delete(':id')
    @HttpProcessor.handle('单个删除')
    public deleteTagId(@Param() { id }) {
        return this.tagService.delete(id)
    }
}