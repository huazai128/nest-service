/*
 * @Author: your name
 * @Date: 2021-01-25 17:27:43
 * @LastEditTime: 2021-01-30 14:43:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.service.ts
 */
import { Injectable } from '@nestjs/common'
import ServiceExt from '@app/utils/serviceExt'
import { PhantomTask } from './task.config'
import { TaskDrawModel } from './task.interface'
import { CacheService, TCacheIntervalResult } from '@app/processors/cache/cache.service'

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
    // 判断是否有新任务添加进来
    private isJoin: boolean = false
    constructor(
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
                console.log('[task log (share card)]: key=', this.currentRedisKey , ' 当前任务余量 ', len)
                this.createTask()
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
            } else { // 如果列队中没有存在任务时
                console.log('[task log (share card)] 队列中没有任务堆积, data = null')
                this.currentRedisKey = this.SHARE_CARD_DATA
                // 没有新任务添加进来， 清除
                if (!this.isJoin) {
                    this.clearTash()
                }
            }
        } catch (error) {
            console.log('[task log (share card)]，读取数据报错：', error)
            setTimeout(() => {
                // 重新读取数据
                this.taskRun()
            }, 1000)
        }
    }

    /**
     * 情况任务
     * @private
     * @memberof TaskService
     */
    private async clearTash() {
        const len: number = await this.cacheService.llen(this.SHARE_CARD_DATA)
        const len1: number = await this.cacheService.llen(this.HEIGH_CARD_KEY)
        if (len === 0 && len1 === 0) {
            this.phantomTask.phantomInstance.exit()
            this.phantomTask.phantomInstance = null
            this.phantomTask.clientPage = null
        }
    }
}
