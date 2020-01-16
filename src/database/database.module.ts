/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:17:22
 * @LastEditTime: 2019-09-02 18:00:55
 * @LastEditors: Please set LastEditors
 */

import { Module, Global } from '@nestjs/common'
import { databaseProviders } from './database.providers'

/**
 * 基础数据
 * @export
 * @class DataBaseModule
 */
@Global()
@Module({
    providers: [databaseProviders],
    exports: [databaseProviders]
})
export default class DataBaseModule {}