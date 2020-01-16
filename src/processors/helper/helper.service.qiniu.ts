/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-15 21:49:21
 * @LastEditTime: 2019-10-03 21:09:21
 * @LastEditors: Please set LastEditors
 */
import { Injectable } from '@nestjs/common'
import * as qiniu from 'qiniu'
import * as APP_CONFIG from '@app/app.config'

export interface IUpToken {
    up_token: string
}

@Injectable()
export class QiniuServicer {
    private mac: qiniu.auth.digest.Mac
    private putPolicy: qiniu.rs.PutPolicy
    constructor() {
        const { accessKey, secretKey, bucket } = APP_CONFIG.QINIU
        this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
        this.putPolicy = new qiniu.rs.PutPolicy({ scope: bucket })
    }

    public getToken(): IUpToken {
        return {
            up_token: this.putPolicy.uploadToken(this.mac)
        }
    }
}