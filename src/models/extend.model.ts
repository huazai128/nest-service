/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-02 15:42:38
 * @LastEditTime: 2019-09-03 10:05:26
 * @LastEditors: Please set LastEditors
 */
import { prop } from 'typegoose'
import { IsString, IsNotEmpty } from 'class-validator'

export class Extend {
    @IsNotEmpty()
    @IsString()
    @prop({ required: true, validate: /\S+/ })
    name: string

    @IsNotEmpty()
    @IsString()
    @prop({ required: true, validate: /\S+/ })
    value: string
}