/*
 * @Author: your name
 * @Date: 2020-10-22 18:53:55
 * @LastEditTime: 2020-11-03 11:14:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/upload/upload.module.ts
 */
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { MulterConfig } from './multer.config'
import { UploadController } from './upload.controller'
import { UploadService } from './upload.service'

@Module({
    imports: [
        MulterModule.registerAsync({
            useClass: MulterConfig
        })
    ],
    controllers: [UploadController],
    providers: [UploadService],
    exports: []
})
export class UplaodModule {}