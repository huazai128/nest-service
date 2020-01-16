/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-22 16:07:24
 * @LastEditTime: 2019-10-28 17:51:47
 * @LastEditors: Please set LastEditors
 */
import { Types } from 'mongoose'
import { prop, plugin, pre, Typegoose } from '@typegoose/typegoose'
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator'
import { mongoosePaginate, mongooseAutoIncrement } from '@app/transforms/mongoose.transform'

@pre<Tag>('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() })
    next()
})

@plugin(mongoosePaginate)
// @plugin(mongooseAutoIncrement.plugin, {
//     model: Tag.name,
//     field: 'id',
//     startAt: 1,
//     incrementBy: 1,
// })

export class Tag  {
    @IsNotEmpty({ message: '标签名称？' })
    @IsString()
    @prop({ required: true, validate: /\S+/ })
    name: string

    @IsNotEmpty({ message: '标签别名？' })
    @IsString({ message: '字符串？' })
    @prop({ required: true, validate: /\S+/ })
    slug: string

    @IsString({ message: '字符串？' })
    @prop()
    description: string

    @prop({ default: Date.now })
    create_at?: Date

    @prop({ default: Date.now })
    update_at?: Date
    _id?: Types.ObjectId

    @prop({ default: 0 })
    count?: number

    @prop({ default: 0 })
    index?: number
}

export class DelTags {

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    ids: Types.ObjectId[]
}

// export const TagModel = getModelBySchema(Tag)
// export const TagProvider = getProviderByModel(TagModel)