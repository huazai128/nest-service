/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-12 15:02:16
 * @LastEditTime: 2019-09-15 22:18:18
 * @LastEditors: Please set LastEditors
 */
import { Module, Global } from '@nestjs/common'
import { QiniuServicer } from './helper.service.qiniu'

@Global()
@Module({
    imports: [],
    providers: [QiniuServicer],
    exports: [QiniuServicer]
})
export class HelperModule {}
