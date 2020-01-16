/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-10 19:15:57
 * @LastEditTime: 2019-10-05 21:58:33
 * @LastEditors: Please set LastEditors
 */
import * as path from 'path'
import { argv } from 'yargs'

export const QINIU = {
    accessKey: argv.qn_accessKey || 'P60VtPqmsO6yzmCl6y4G4wou-cAooJAsdlqdqQB5',
    secretKey: argv.qn_secretKey || 'ZurGg2hsfcACVy0If1TmZPvxLymH0s5k-CaBPJfC',
    bucket: argv.qn_bucket || 'cloudimg01',
    origin: argv.qn_origin || 'qiniu origin url',
}

export const REDIS = {
    host: argv.redis_host || '211.159.219.193',
    port: argv.redis_port || 63791,
    ttl: null,
    defaultCacheTTL: 60 * 60 * 24,
    no_ready_check: true,
    password: 'WdPTMj6X',
}
