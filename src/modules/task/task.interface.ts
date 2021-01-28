/*
 * @Author: your name
 * @Date: 2021-01-26 18:15:56
 * @LastEditTime: 2021-01-26 18:21:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/task/task.interface.ts
 */
export interface TaskDrawModel {
    // 画卡数据
    drawData: any
    // 权重
    weight?: 'max' | 'normal'
    // 回调接口
    cbApi: string
    // 唯一标示
    taskKey: string
}