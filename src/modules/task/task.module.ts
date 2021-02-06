/*
 * @Author: your name
 * @Date: 2021-01-25 17:27:25
 * @LastEditTime: 2021-02-04 17:45:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.module.ts
 */

import { Module, HttpModule } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'

@Module({
    imports: [HttpModule],
    controllers: [TaskController],
    providers: [TaskService],
    exports: []
})
export class TaskModule {}