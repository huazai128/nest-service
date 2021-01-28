/*
 * @Author: your name
 * @Date: 2020-10-22 18:54:28
 * @LastEditTime: 2021-01-25 18:28:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/upload/upload.service.ts
 */
import { Injectable } from '@nestjs/common'
import ServiceExt from '@app/utils/serviceExt'
import { resolve } from 'path'
import { existsSync, mkdirs, move, readdir, createWriteStream, createReadStream, unlinkSync, rmdirSync } from 'fs-extra'

@Injectable()
export class UploadService extends ServiceExt {
    constructor() {
        super()
    }
    // 上传文件存放目录
    private UPLOAD_DIR: string = resolve(__dirname, '../../../', 'uploads')

    /**
     * 验证文件是否上传
     * @param {*} { fileHash, filename }
     * @returns
     * @memberof UploadService
     */
    public async verifyUpload({ fileHash, filename }) {
        const ext = this.extractExt(filename)
        const filePath = resolve(this.UPLOAD_DIR, `${ fileHash }${ ext }`)
        // 文件已存在说明已经上传完成
        if (existsSync(filePath)) {
            return { shouldUpload: false }
        } else {
            const list = await this.createUploadedList(fileHash)
            return {
                shouldUpload: true,
                uploadedList: list
            }
        }
    }

    /**
     * 处理分片上传
     * @param {*} chunk
     * @param {*} fields
     * @memberof UploadService
     */
    public async handleFormData(chunk, { hash, filename, fileHash }) {
        // 文件路径
        const filePath = resolve(this.UPLOAD_DIR, `${ fileHash }${this.extractExt(filename)}`)
        // 文件切片
        const chunkDir = resolve(this.UPLOAD_DIR, fileHash)
        // 判断文件是否存在
        if (existsSync(filePath)) {
            return  { msg: '文件存在，继续上传中' }
        }
        // 如果切片文件不存在, 创建文件
        if (!existsSync(chunkDir)) {
            await mkdirs(chunkDir)
        }
        // 移动文件
        await move(chunk.path, resolve(chunkDir, hash))
        return { msg: '上传成功' }
    }

    /**
     * 获取文件前端
     * @private
     * @param {string} filename
     * @returns
     * @memberof UploadService
     */
    private extractExt(filename: string) {
        return filename.slice(filename.lastIndexOf('.'), filename.length)
    }

    /**
     * 用于判断是否已经有上传的文件
     * @private
     * @param {string} fileHash
     * @returns {(Promise<string[]> | [])}
     * @memberof UploadService
     */
    private createUploadedList(fileHash: string): Promise<string[]> | [] {
        return existsSync(resolve(this.UPLOAD_DIR, fileHash)) ? readdir(resolve(this.UPLOAD_DIR, fileHash)) : []
    }

    /**
     * 合并文件
     * @param {*} { fileHash, filename, size： 文件切片大小 }
     * @memberof UploadService
     */
    public async mergeUpload({ fileHash, filename, size }) {
        // 获取文件的后缀
        const ext = this.extractExt(filename)
        // 获取文件
        const filePath = resolve(this.UPLOAD_DIR, `${fileHash}${ext}`)
        // 获取切片文件目录
        const chunkDir = resolve(this.UPLOAD_DIR, fileHash)
        // 获取所有切片文件
        const chunkPaths = await readdir(chunkDir)
        // 防止文件排序混乱，导致文件错位
        chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1])
        await Promise.all(
            chunkPaths.map((chunkPath, index) => this.pipeStream(resolve(chunkDir, chunkPath), createWriteStream(filePath, {
                start: index * size,
                end: (index + 1) * size
            })) )
        )
        // 删除切片文件目录
        rmdirSync(chunkDir)
        return { msg: '合并完成' }
    }

    /**
     * 合并流
     * @private
     * @param {*} path 切片路径
     * @param {*} writeStream 读取文件的流
     * @memberof UploadService
     */
    private pipeStream(path, writeStream): Promise<void> {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise((resolve, reject) => {
            // 创建一个读流
            const reaStream = createReadStream(path)
            // 监听流读取结束
            reaStream.on('end', () => {
                unlinkSync(path)
                resolve()
            })
            reaStream.pipe(writeStream)
        })
    }
}