/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 22:32:36
 * @LastEditTime: 2019-11-05 14:16:17
 * @LastEditors: Please set LastEditors
 */
import { Types } from 'mongoose'
import { pre, plugin, arrayProp, prop, Ref, modelOptions, getModelForClass } from '@typegoose/typegoose'
import { IsNotEmpty, IsString, Length, IsArray, ArrayUnique, IsDefined, IsIn, IsInt, ArrayNotEmpty } from 'class-validator'
import { EPublicState, EPublishState } from '@app/interfaces/state.interface'
import { mongoosePaginate } from '@app/transforms/mongoose.transform'
import { Tag } from '@app/modules/tag/tag.model'
import { Extend } from '@app/models/extend.model'

export function getDefaultMeta(): Meta {
    return {
        likes: 0,
        views: 0,
        comments: 0,
    }
}

// 元数据
export class Meta {
    @IsInt()
    @prop({ default: 0 })
    likes: number

    @IsInt()
    @prop({ default: 0 })
    views: number

    @IsInt()
    @prop({ default: 0 })
    comments: number
}

@pre<Article>('findOneAndUpdate', function(next) {
    this.findOneAndUpdate({}, { update_at: Date.now() })
    next()
})
@pre<Article>('save', function(next) { // 不能使用箭头函数，this会发生偏移
    next()
})
@modelOptions({
    schemaOptions: {
        toObject: {
            getters: true
        }
    }
})
@plugin(mongoosePaginate)
export class Article  {

    // 文章内容
    @IsNotEmpty({ message: '文字内容？' })
    @IsString({ message: '字符串？' })
    @prop({ required: true, validate: /\S+/ })
    content: string

    // 标题
    @Length(3, 30)
    @IsNotEmpty({ message: '文字标题？' })
    @IsString({ message: '字符串？' })
    @prop({ required: true, validate: /\S+/ })
    title: string

    // 简介
    @prop({ set: (val: string) => {
        return val ? val.substring(0, 130) : val
    }, get: (val: string) => val })
    t_content: string

    // 描述
    @IsString({ message: '字符串？' })
    @prop()
    description: string

    // 缩略图
    @IsString({ message: '字符串？' })
    @prop()
    thumb: string

    // 关键字
    @IsArray()
    @ArrayUnique()
    @arrayProp({ items: String })
    keywords: string[]

    // 文章发布状态
    @IsDefined()
    @IsIn([EPublishState.Draft, EPublishState.Published, EPublishState.Recycle])
    @IsInt({ message: '有效状态？' })
    @prop({ default: EPublishState.Published })
    state: EPublishState

    // 文章公开状态
    @IsDefined() // 检测值是否定义
    @IsIn([EPublicState.Public, EPublicState.Password, EPublicState.Secret])
    @IsInt({ message: '有效状态？' })
    @prop({ default: EPublicState.Public })
    public: EPublicState

    // 标签
    @arrayProp({ itemsRef: Tag })
    tags?: Array<Ref<Tag>>

    // 其他元信息
    @prop({ default: getDefaultMeta() })
    meta!: Meta

    // 发布时间
    @prop({ default: Date.now })
    create_at?: Date

    // 更新时间
    @prop({ default: Date.now })
    update_at?: Date

    // @arrayProp({ items: Extend })
    // extends?: Extend[]

    // 相关文章
    related?: Article[]
}

export class DelActicles {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    article_idS: Types.ObjectId[]
}
