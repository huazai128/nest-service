/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-12 15:02:25
 * @LastEditTime: 2019-09-16 17:45:00
 * @LastEditors: Please set LastEditors
 */
import { Controller, Get, Post } from '@nestjs/common'
import { HttpProcessor } from '@app/decorators/http.decorator'
import { IUpToken, QiniuServicer } from '@app/processors/helper/helper.service.qiniu'

/**
 * 插件扩张
 * @export
 * @class ExpansionController
 */
@Controller('expansion')
export class ExpansionController {

    constructor(private qiniuService: QiniuServicer) {
    }

    @Post('uptoken')
    @HttpProcessor.handle('获取token')
    getQiniuUpToken(): IUpToken {
        return this.qiniuService.getToken()
    }
}