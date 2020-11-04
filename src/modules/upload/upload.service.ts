/*
 * @Author: your name
 * @Date: 2020-10-22 18:54:28
 * @LastEditTime: 2020-11-04 10:12:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/upload/upload.service.ts
 */
import { Injectable } from '@nestjs/common'
import ServiceExt from '@app/utils/serviceExt'
import { resolve } from 'path'
import { existsSync } from 'fs-extra'

@Injectable()
export class UploadService extends ServiceExt {

    // 上传文件存放目录
    private UPLOAD_DIR: string = resolve(__dirname, '../../../', 'uploads')

    /**
     * 验证文件是否上传
     * @param {*} { fileHash, filename }
     * @returns
     * @memberof UploadService
     */
    public verifyUpload({ fileHash, filename }) {
        console.log(fileHash)
        const ext = this.extractExt(filename)
        const filePath = resolve(this.UPLOAD_DIR, `${ fileHash }${ ext }`)
        // 文件已存在说明已经上传完成
        if (existsSync(filePath)) {
            return { shouldUpload: false }
        } else {
            return {
                shouldUpload: true,
                uploadedList: []
            }
        }
    }

    /**
     * 处理分片上传
     * @param {*} chunk
     * @param {*} fields
     * @memberof UploadService
     */
    public handleFormData(chunk, { hash, filename, fileHash }) {
        // 文件路径
        const filePath = resolve(this.UPLOAD_DIR, `${ fileHash }${this.extractExt(filename)}`)
        const chunkDir = resolve(this.UPLOAD_DIR, fileHash)
        return { msg: '上传成功' }
    }

    /**
     * 判断文件存在
     * @private
     * @param {string} filename
     * @returns
     * @memberof UploadService
     */
    private extractExt(filename: string) {
        return filename.slice(filename.lastIndexOf('.'), filename.length)
    }
}