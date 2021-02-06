/*
 * @Author: your name
 * @Date: 2021-01-25 17:27:43
 * @LastEditTime: 2021-02-06 11:11:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.service.ts
 */
import { Injectable, HttpService } from '@nestjs/common'
import ServiceExt from '@app/utils/serviceExt'
import { PhantomTask } from './task.config'
import { TaskDrawModel } from './task.interface'
import { CacheService, TCacheIntervalResult } from '@app/processors/cache/cache.service'
import { retry } from 'rxjs/operators'

/**
 * 画卡、截图服务
 * @export
 * @class TaskService
 * @extends {ServiceExt}
 */
@Injectable()
export class TaskService extends ServiceExt {
    private phantomTask: PhantomTask
    // 高任务key
    private HEIGH_CARD_KEY: string = 'HEIGH_CARD_KEY'
    // 低任务key
    private SHARE_CARD_DATA: string = 'SHARE_CARD_DATA'
    // 当前key
    private currentRedisKey: string = this.SHARE_CARD_DATA
    // 用于存储当前画卡
    private currentTaskData: any = null
    // 判断是否有新任务添加进来
    private isJoin: boolean = false
    constructor(
        private readonly httpService: HttpService,
        private readonly cacheService: CacheService,
    ) {
        super()
        this.phantomTask = new PhantomTask()
    }

    /**
     * 画卡
     * @param {*} body
     * @memberof TaskService
     */
    public async cardTask(body: TaskDrawModel) {
        this.isJoin = true
        // 产生唯一标识， 用于后续逻辑判断
        body.taskKey = Date.now() + '' + Math.round(Math.random() * 1000)
        const data = JSON.stringify(body).replace(/\u2028/g, '')
        // 更加权重追加到相应的List数据中
        const key = Object.is(body.weight, 'max') ? this.HEIGH_CARD_KEY : this.SHARE_CARD_DATA
        const status = await this.cacheService.lpush(key, data)
        setTimeout(async () => {
            // 如果不存在任务， 就创建
            if (!this.phantomTask.phantomInstance) {
                await this.phantomTask.initTask()
                // 更新任务key
                this.currentRedisKey = key
                this.taskRun()
            }
            this.isJoin = false
        }, 10)
        return { msg: Object.is(status, 'success') ? '任务添加成功' : '添加任务到队列失败' }
    }

    /**
     * 运行任务
     * @private
     * @memberof TaskService
     */
    private async taskRun() {
        try {
            // 获取任务长度
            const len = await this.cacheService.llen(this.currentRedisKey)
            if (len > 0) {
                const timer = null
                console.log('[task log (share card)]: key=', this.currentRedisKey , ' 当前任务余量 ', len)
                Promise.race([
                    new Promise(async (resolve, reject) => {
                        try {
                            await this.createTask()
                            clearTimeout(timer)
                            resolve('')
                        } catch (error) {
                            reject(error)
                        }
                    }),
                    new Promise(async (resolve, reject) => {
                        try {
                            // 防止某个任务被卡住影响所有画卡任务
                            await this.taskOvertime(timer)
                        } catch (error) {
                            reject(error)
                        }
                    }),
                ])
            }
        } catch (error) {
            console.error('[task log (share card)]: 查询剩余任务数量出错', error)
            console.log('[task log (share card)]: 尝试重新查询...')
            setTimeout(() => {
                this.taskRun()
            }, 1000)
        }
    }

    /**
     * 读取数据开始任务
     * @private
     * @memberof TaskService
     */
    private async createTask() {
        try {
            const _serverRequestStartTime: [number, number] = process.hrtime()
            const result = await this.cacheService.rpop(this.currentRedisKey)
            const _serverRequestEndTime: [number, number] = process.hrtime()
            const ms = (_serverRequestEndTime[0] - _serverRequestStartTime[0]) * 1e3 + (_serverRequestEndTime[1] - _serverRequestStartTime[1]) * 1e-6
            console.log('[task log (share card)]: 读取数据成功用时: ', ms, 'ms')
            if (result) {
                console.log('[task log (share card)]: 开始执行任务--', result)
                const shareData = JSON.parse(result)
                // 当前正在画卡的图片
                this.currentTaskData = shareData
                const taskKey = this.currentTaskData.taskKey
                // 触发前端画卡
                const imageUrl = await this.phantomTask.createShareCard(shareData.drawData)
                console.log(`taskKey=${taskKey} --- shareData.taskKey=${shareData.taskKey}`)
                // 判断是否是否一致
                if (taskKey === shareData.taskKey) {
                    console.log('taskKey')
                    this.requestCallback(imageUrl, shareData)
                } else {
                    console.log('任务已超时，不做推卡处理')
                }
            } else { // 如果列队中没有存在任务时
                console.log('[task log (share card)] 队列中没有任务堆积, data = null')
                this.clearTask()
            }
        } catch (error) {
            console.log('[task log (share card)]，读取数据报错：', error)
            // 抛出异常
            throw new Error(error)
        }
    }

    /**
     * 画卡成功后的回调
     * @private
     * @param {string} imgUrl
     * @param {TaskDrawModel} data
     * @memberof TaskService
     */
    private requestCallback(imgUrl: string, data: TaskDrawModel) {
        try {
            const parmas = {
                userId: data.userId,
                taskId: data.taskId,
                imgUrl
            }
            this.httpService.post(data.cbApi, {...parmas}).pipe(
                retry(3) // 重连三次
            ).subscribe(() => {
                console.log('请求成功')
            })
        } catch (error) {
            console.error(`[task err (share card)]: 回调Java错误=${ data.cbApi }`, error)
        }
    }

    /**
     * 用于处理任务超时问题，阻塞画卡进度
     * @private
     * @param {*} timer
     * @memberof TaskService
     */
    private taskOvertime(timer: any) {
        const _serverRequestStartTime: [number, number] = process.hrtime()
        return new Promise((resolve, reject) => {
            timer = setTimeout(async () => {
                const _serverRequestEndTime = process.hrtime()
                const ms = (_serverRequestEndTime[0] - _serverRequestStartTime[0]) * 1e3 + (_serverRequestEndTime[1] - _serverRequestStartTime[1]) * 1e-6
                console.error('[task log (share card)]: 失败用时: ', ms, 'ms')
                if (!this.currentTaskData.hadCached) {
                    console.log('超时任务，push到redis后重试, data=', JSON.stringify(this.currentTaskData))
                    this.currentTaskData.hadCached = true
                    await this.cacheService.lpush(this.HEIGH_CARD_KEY, JSON.stringify(this.currentTaskData))
                } else {
                    console.log('任务已经被重试过，不再重试任务')
                }
                reject('create card timeout.超时!')
            }, 5000)
        })
    }

    /**
     * 清除任务
     * @private
     * @memberof TaskService
     */
    private async clearTask() {
        const len: number = await this.cacheService.llen(this.SHARE_CARD_DATA)
        const len1: number = await this.cacheService.llen(this.HEIGH_CARD_KEY)
        // 如果所有任务都没有，并且也没有新的任务添加进来，则清除
        if (len === 0 && len1 === 0 && !this.isJoin) {
            this.phantomTask.phantomInstance.exit()
            this.phantomTask.phantomInstance = null
            this.phantomTask.clientPage = null
        } else {
            if (len > 0) {
                this.currentRedisKey = this.SHARE_CARD_DATA
            }
            if (len1 > 0) {
                this.currentRedisKey = this.HEIGH_CARD_KEY
            }
            this.taskRun()
        }
    }
}
