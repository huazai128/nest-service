/*
 * @Author: your name
 * @Date: 2019-10-28 15:51:34
 * @LastEditTime: 2019-10-28 17:41:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/modules/test/test.model.ts
 */
import { prop, getModelForClass, Typegoose } from '@typegoose/typegoose'
import { IsString } from 'class-validator'

export class Test {
    @IsString()
    @prop({ required: true })
    name: string
}

export const TestModel = getModelForClass(Test, {
    schemaOptions: {
        toObject: {
            getters: true
        }
    }
})
