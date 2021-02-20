/*
 * @Author: your name
 * @Date: 2021-01-25 17:27:08
 * @LastEditTime: 2021-02-20 15:43:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.conntroller.ts
 */
import { Controller, Post, Body, Get, Query, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskDrawModel } from './task.interface'

const data =  {
    width: 750,
    height: 1344,
    backgroundColor: '#fff',
    scale: 2,
    debug: false,
    images: [
      {
        url: 'https://img.qlchat.com/qlLive/activity/image/7HLZWL54-C6R8-7OVO-1607686332022-WGCZ4G3TMJNY.png',
        width: 750,
        height: 1344,
        y: 0,
        x: 0,
        zIndex: 1
      },
      {
        url: 'https://img.qlchat.com/qlLive/activity/image/FILQTI1R-VIHW-JCDZ-1607588173476-5VAERQKNDQ75.png',
        width: 66,
        height: 66,
        x: 35,
        y: 35,
        zIndex: 3,
        borderRadius: 66
      },
      {
        url: 'https://img.qlchat.com/qlLive/activity/image/FILQTI1R-VIHW-JCDZ-1607588173476-5VAERQKNDQ75.png',
        width: 180,
        height: 180,
        x: 505,
        y: 1105,
        zIndex: 3
      },
      {
        url: 'https://img.qlchat.com/qlLive/activity/image/FILQTI1R-VIHW-JCDZ-1607588173476-5VAERQKNDQ75.png',
        width: 147,
        height: 44,
        x: 70,
        y: 1138,
        zIndex: 4
      }
    ],
    texts: [
      {
        x: 112,
        y: 56,
        text: '华仔',
        fontSize: 22,
        color: '#333',
        opacity: 1,
        baseLine: 'middle',
        lineHeight: 44,
        lineNum: 1,
        textAlign: 'left',
        zIndex: 100,
        fontWeight: '600',
      }
    ]
  }

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
    @Get('card')
    public async pictureCard(@Body() body: TaskDrawModel) {
        const params = {
            drawData: data,
            cbApi: '',
            userId: '',
            taskId: '',
        }
        return await this.taskService.cardTask(params)
    }
}