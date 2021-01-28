/*
 * @Author: your name
 * @Date: 2021-01-25 17:27:43
 * @LastEditTime: 2021-01-27 14:55:36
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
    private HEIGH_CARD_KEY: string = 'HEIGH_CARD_KEY'
    private SHARE_CARD_DATA: string = 'SHARE_CARD_DATA'
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
        body.taskKey = Date.now() + '' + Math.round(Math.random() * 1000)
        const data = JSON.stringify(body).replace(/\u2028/g, '')
        // 更加权重追加到相应的List数据中
        const key = Object.is(body.weight, 'max') ? this.HEIGH_CARD_KEY : this.SHARE_CARD_DATA
        return new Promise((reslove, reject) => {
            // 添加到List数据
            this.cacheService.redisClient.lpush(key, data, (err) => {
                if (err) {
                    console.error('[task error (share card)]: 添加任务到队列失败 ', err, data)
                    reject({ msg: '添加任务到队列失败' })
                } else {
                    // 不存在就创建
                    if (!this.phantomTask.phantomInstance) {
                        this.phantomTask.initTask()
                    }
                    reslove({ msg: '任务添加成功' })
                }
            })
        })
    }
}
