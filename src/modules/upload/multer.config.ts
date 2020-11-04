/*
 * @Author: your name
 * @Date: 2020-11-03 10:35:27
 * @LastEditTime: 2020-11-03 11:06:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/upload/multer.config.ts
 */
import { Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            dest: './uploads'
        }
    }
}