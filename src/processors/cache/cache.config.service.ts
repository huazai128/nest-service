/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-05 21:43:30
 * @LastEditTime: 2019-10-25 17:09:03
 * @LastEditors: Please set LastEditors
 */
import * as APP_CONFIG from '@app/app.config'
import * as redisStore from 'cache-manager-redis-store'
import { ClientOpts, RetryStrategyOptions } from 'redis'
import { Injectable, CacheOptionsFactory, CacheModuleOptions } from '@nestjs/common'

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
    // 重试策略
    public retryStrategy(opts: RetryStrategyOptions) {
        console.error('Reids 发生异常！', opts.error)
        if (opts.error && opts.error.code === 'ECONNREFUSED') {
            return new Error('Redis 服务器拒绝连接！')
        }
        if (opts.total_retry_time > 1000 * 60) {
            return new Error('Redis 重试时间已用完！')
        }
        if (opts.attempt > 6) {
            return new Error('Redis 尝试次数已达极限！')
        }
        return Math.min(opts.attempt * 100, 3000)
    }

    createCacheOptions(): CacheModuleOptions {
        const redisOptions: ClientOpts = {
            host: APP_CONFIG.REDIS.host as string,
            port: APP_CONFIG.REDIS.port as number,
            retry_strategy: this.retryStrategy.bind(this),
            no_ready_check: APP_CONFIG.REDIS.no_ready_check as boolean,
            password: APP_CONFIG.REDIS.password as string
        }
        return {
            store: redisStore,
            ttl: APP_CONFIG.REDIS.ttl,
            ...redisOptions
        }
    }
}