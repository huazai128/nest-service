/*
 * @Author: your name
 * @Date: 2020-10-22 18:53:14
 * @LastEditTime: 2020-11-03 16:04:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/upload/upload.controller.ts
 */
import { Controller, Post, Body, Get, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FileFieldsInterceptor, FilesInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService
    ) {
        console.log(1)
    }
    @Get('verify')
    public verifyUpload(@Query() query: any) {
        return this.uploadService.verifyUpload(query)
    }

    @Post('fileChunk')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'hash' },
        { name: 'chunk' },
        { name: 'filename' },
        { name: 'fileHash' },
      ]))
    public async uploadFile(@UploadedFiles() files, @Body() body) {
        const [ chunk ] = files.chunk
        const { hash, filename, fileHash } = body
        return await this.uploadService.handleFormData(chunk, body)
    }
}