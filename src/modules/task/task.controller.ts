/*
 * @Author: your name
 * @Date: 2021-01-25 17:27:08
 * @LastEditTime: 2021-01-26 18:38:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.conntroller.ts
 */
import { Controller, Post, Body, Get, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { TaskService } from './task.service'

@Controller('task')
export class TaskController {
    constructor(
        private readonly taskService: TaskService
    ) {}
    /**
     * 画卡
     * @param {*} query
     * @returns
     * @memberof TaskController
     */
    @Post('card')
    public async pictureCard(@Body() body: any) {
        const result = await this.taskService.cardTask(body)
        return result
    }
}