/*
 * @Author: your name
 * @Date: 2019-10-28 15:51:25
 * @LastEditTime: 2019-10-29 09:55:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/test/test.service.ts
 */
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { Test, TestModel } from './test.model'
import { PaginateModel, Document } from 'mongoose'

@Injectable()
export class TestService {
    constructor(@InjectModel(Test) private readonly testModel: ReturnModelType<typeof Test>) {}
}