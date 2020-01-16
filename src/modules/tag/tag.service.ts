/*
 * @Description: In User Settings Edit
 * @Author: 华仔
 * @Date: 2019-06-22 16:05:09
 * @LastEditTime: 2019-10-28 17:51:14
 * @LastEditors: Please set LastEditors
 */
import { InjectModel } from 'nestjs-typegoose'
import { PaginateResult, Types } from 'mongoose'
import { Injectable, Type } from '@nestjs/common'
import ServiceExt from '@app/utils/serviceExt'
import { TMongooseModel } from '@app/interfaces/mongoose.interface'
import { ReturnModelType } from '@typegoose/typegoose'
import { Tag } from './tag.model'

/**
 * Tag服务
 * @export
 * @class TagService
 * @extends {ServiceExt}
 */
@Injectable()
export class TagService extends ServiceExt {
    constructor(@InjectModel(Tag) private readonly tagModel: TMongooseModel<Tag> & ReturnModelType<typeof Tag> ) {
        super()
    }
    /**
     * 新增标签
     * @memberof TagService
     */
    async create(newTag: Tag): Promise<Tag | any> {
        const { name } = newTag
        const tag = await this.getTagInfo(name)
        if (tag) {
            return {
                msg: '标签已存在'
            }
        }
        return new this.tagModel(newTag).save().then((curTag) => {
            return this.handleReturn({ data: curTag, code: 200 }) // 不能使用 ... 这样会返回原始类型数据
        }).catch((err) => {
            return {
                msg: '保存失败'
            }
        })
    }

    /**
     * 根据slug获取当前tag相关信息
     * @memberof TagService
     */
    async getTagInfo(name: string): Promise<Tag> {
        return this.tagModel.findOne({ name }).exec().then((tag) => {
            return tag
        })
    }

    /**
     * 获取所有标签
     * @returns {Promise<Tag[]>}
     * @memberof TagService
     */
    async getAllTag(query, options): Promise<any> {
        return this.tagModel.paginate(query, options).then((tags) => {
            return tags
        })
    }
    /**
     * 批量删除
     * @returns {Promise<any>}
     * @memberof TagService
     */
    async batchDelete(tadIds: Types.ObjectId[]): Promise<any> {
        return this.tagModel.find({  _id: { $in: tadIds } }).exec().then((tags) => {
            if (!tags.length) {
                return {
                    msg: '删除失败，标签不存在'
                }
            }
            return this.tagModel.deleteMany({ _id: { $in: tadIds } }).exec()
            .then((result) => {
                return { }
            })
        })
    }

    /**
     * 单个删除标签
     * @param {Types.ObjectId} tagId
     * @returns {Promise<Tag>}
     * @memberof TagService
     */
    public delete(tagId: Types.ObjectId): Promise<any> {
        return this.tagModel.findByIdAndRemove(tagId).exec().then((result) => {
            return result
        }).catch((err) => {
            console.log(err)
        })
    }
}