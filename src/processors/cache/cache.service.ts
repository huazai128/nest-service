/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-05 21:43:45
 * @LastEditTime: 2021-01-27 14:55:03
 * @LastEditors: Please set LastEditors
 */
import { RedisClient } from 'redis'
import * as schedule from 'node-schedule'
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common'

// Cache 客户端管理器
export interface ICacheManager {
    store: {
      getClient(): RedisClient;
    }
    get(key: TCacheKey): any
    set(key: TCacheKey, value: string, options?: { ttl: number }): any
}

// 获取器
export type TCacheKey = string
export type TCacheResult<T> = Promise<T>

// IO 模式通用返回结构
export interface ICacheIoResult<T> {
    get(): TCacheResult<T>
    update(): TCacheResult<T>
}

// Promise 模式参数
export interface ICachePromiseOption<T> {
    key: TCacheKey
    promise(): TCacheResult<T>
}

// Promise & IO 模式参数
export interface ICachePromiseIoOption<T> extends ICachePromiseOption<T> {
    ioMode?: boolean
}

// Interval & Timeout 超时模式参数
export interface ICacheIntervalTimeoutOption {
    error?: number
    success?: number
}

// Interval & Timing 定时模式参数
export interface ICacheIntervalTimingOption {
    error: number
    schedule: any
}

// Interval 模式参数
export interface ICacheIntervalOption<T> {
    key: TCacheKey
    promise(): TCacheResult<T>
    timeout?: ICacheIntervalTimeoutOption
    timing?: ICacheIntervalTimingOption
}

// Interval 模式返回类型
export type TCacheIntervalResult<T> = () => TCacheResult<T>

// Interval & IO 模式参数
export interface ICacheIntervalIOOption<T> extends ICacheIntervalOption<T> {
    ioMode?: boolean
}

@Injectable()
export class CacheService {
    // 此处提供redis相关挨批操作
    public redisClient: RedisClient
    // 页面缓存
    private cache!: ICacheManager
    // 通过注入拿到config.service返回的配置信息
    constructor(@Inject(CACHE_MANAGER) cache: ICacheManager) {
        console.log(cache)
        this.cache = cache
        this.redisClient = this.cache.store.getClient()
        this.redisClient.on('ready', () => {
            console.info('Redis 已准备好！')
        })
        // 监听redis事件
        const arr = ['connect', 'reconnecting', 'end', 'close', 'error']
        arr.forEach(e => {
            this.redisClient.on(e, function(evt) {
                console.log('redis status: ' + e)
                if ('error' === e) {
                    console.error(evt)
                }
            })
        })
    }

    // 客户端是否可用
    private get checkCacheServiceAvailable(): boolean {
        return this.redisClient.connected
    }

    // 获取值
    public get<T>(key: TCacheKey): TCacheResult<T> {
        if (!this.checkCacheServiceAvailable) {
            return Promise.reject('缓存客户端没准备好！')
        }
        return this.cache.get(key)
    }

    // 缓存值
    public set<T>(key: TCacheKey, value: any, options?: { ttl: number }): TCacheResult<T> {
        if (!this.checkCacheServiceAvailable) {
            return Promise.reject('缓存客户端没准备好！')
        }
        return this.cache.set(key, value, options)
    }

    /**
     * 获取List 长度
     * @param {string} key
     * @returns {Promise<number>}
     * @memberof CacheService
     */
    public llen(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.redisClient.llen(key, (err, len) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(len)
                }
            })
        })
    }
    /**
     * @function promise
     * @description 被动更新 | 双向同步 模式，Promise -> Redis
     * @example CacheService.promise({ key: CacheKey, promise() }) -> promise()
     * @example CacheService.promise({ key: CacheKey, promise(), ioMode: true }) -> { get: promise(), update: promise() }
     */
    promise<T>(options: ICachePromiseOption<T>): TCacheResult<T>
    promise<T>(options: ICachePromiseIoOption<T>): ICacheIoResult<T>
    promise(options) {

        const { key, promise, ioMode = false } = options

        // 包装任务
        const promiseTask = (resolve, reject) => {
            return promise().then(data => {
                    this.set(key, data)
                    resolve(data)
                }).catch(reject)
        }

        // Promise 拦截模式（返回死数据）
        const handlePromiseMode = () => {
            return new Promise((resolve, reject) => {
                this.get(key)
                .then(value => {
                    value !== null && value !== undefined
                    ? resolve(value)
                    : promiseTask(resolve, reject)
                })
                .catch(reject)
            })
        }

        // 双向同步模式（返回获取器和更新器）
        const handleIoMode = () => ({
            get: handlePromiseMode,
            update: () => new Promise(promiseTask),
        })
        return ioMode ? handleIoMode() : handlePromiseMode()
    }

    /**
     * @function interval
     * @description 定时 | 超时 模式，Promise -> Task -> Redis
     * @example CacheService.interval({ key: CacheKey, promise(), timeout: {} }) -> promise()
     * @example CacheService.interval({ key: CacheKey, promise(), timing: {} }) -> promise()
     */
    public interval<T>(options: ICacheIntervalOption<T>): TCacheIntervalResult<T>
    public interval<T>(options: ICacheIntervalIOOption<T>): ICacheIoResult<T>
    public interval<T>(options) {

        const { key, promise, timeout, timing, ioMode = false } = options

        // 包装任务
        const promiseTask = (): Promise<T> => {
            return promise().then(data => {
                this.set(key, data)
                return data
            })
        }

        // 超时任务
        if (timeout) {
            const doPromise = () => {
                promiseTask()
                .then(_ => {
                    setTimeout(doPromise, timeout.success)
                })
                .catch(error => {
                    const time = timeout.error || timeout.success
                    setTimeout(doPromise, time)
                    console.warn(`Redis 超时任务执行失败，${time}s 后重试：${error}`)
                })
            }
            doPromise()
        }

        // 定时任务
        if (timing) {
            const doPromise = () => {
                promiseTask()
                .then(data => data)
                .catch(error => {
                    console.warn(`Redis 定时任务执行失败，${timing.error}s 后重试：${error}`)
                    setTimeout(doPromise, timing.error)
                })
            }
            doPromise()
            schedule.scheduleJob(timing.schedule, doPromise)
        }

        // 获取器
        const getKeyCache = () => this.get(key)

        // 双向同步模式（返回获取器和更新器）
        const handleIoMode = () => ({
            get: getKeyCache,
            update: promiseTask,
        })

        // 返回 Redis 获取器
        return ioMode ? handleIoMode() : getKeyCache
    }
}