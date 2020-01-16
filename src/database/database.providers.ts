/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:17:22
 * @LastEditTime: 2019-09-02 17:54:50
 * @LastEditors: Please set LastEditors
 */

import { mongoose } from '@app/transforms/mongoose.transform'
import logger from '@app/utils/logger'
import { DATABASE_CONNECTION_TOKEN, DB_CONN } from '@app/config/db'

export const databaseProviders = {
    provide: DATABASE_CONNECTION_TOKEN,
    useFactory: async () => {
        const RECONNET_INTERVAL = 6000

        // 连接数据库
        const connection = () => mongoose.connect(DB_CONN, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            autoReconnect: true,
            reconnectInterval: RECONNET_INTERVAL,
        })
        mongoose.connection.on('error', (error) =>  {
            const timeout = 6
            setTimeout(connection, timeout)
            setTimeout(() => logger.warn(`数据库连接失败！将在 ${timeout}s 后重试`, error), 0)
        })
        mongoose.connection.on('open', () => {
            setTimeout(() => logger.info('数据库连接成功'), 0)
        })

        mongoose.connection.on('connecting', () => {
            console.log('数据库连接中...')
        })

        mongoose.connection.on('open', () => {
            console.info('数据库连接成功！')
        })

        mongoose.connection.on('disconnected', () => {
            console.error(`数据库失去连接！尝试 ${RECONNET_INTERVAL / 1000}s 后重连`)
            setTimeout(connection, RECONNET_INTERVAL)
          })

        mongoose.connection.on('error', error => {
            console.error('数据库发生异常！', error)
            mongoose.disconnect()
        })

        return await connection()
    }
}