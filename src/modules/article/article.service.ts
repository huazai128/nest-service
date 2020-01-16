/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-27 22:34:13
 * @LastEditTime: 2019-11-05 19:54:29
 * @LastEditors: Please set LastEditors
 */
import { Injectable, Type } from '@nestjs/common'
import * as CACHE_KEY from '@app/constants/cache.constants'
import { PaginateResult, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { CacheService, TCacheIntervalResult } from '@app/processors/cache/cache.service'
import { TagService } from '@app/modules/tag/tag.service'
import ServiceExt from '@app/utils/serviceExt'
import { TMongooseModel } from '@app/interfaces/mongoose.interface'
import { ReturnModelType } from '@typegoose/typegoose'
import { ESortType, EPublishState } from '@app/interfaces/state.interface'
import { Article, DelActicles } from './article.model'
/**
 * @export
 * @class ArticleService
 * @extends {ServiceExt}
 */
@Injectable()
export class ArticleService extends ServiceExt {
    private hotArticleListCache: TCacheIntervalResult<PaginateResult<Article>>
    constructor(
        private readonly cacheService: CacheService,
        private readonly tagService: TagService,
        @InjectModel(Article) private readonly articleModel: TMongooseModel<Article> & ReturnModelType<typeof Article>
    ) {
        super()
        this.hotArticleListCache = this.cacheService.interval({
            timeout: {
                success: 1000 * 60 * 30, // 成功后 30 分钟更新一次数据
                error: 1000 * 60 * 5, // 失败后 5 分钟更新一次数据
            },
            key: CACHE_KEY.HOT_ARTICLES,
            promise: () => {
                const options = {
                    limit: 10,
                    sort: this.getHotSort()
                }
                return this.getArticle.bind(this)(null, options)
            }
        })
    }

    /**
     * 获取热门查询条件
     * @public
     * @returns {object}
     * @memberof ArticleService
     */
    public getHotSort(): object {
        return {
            'meta.comments': ESortType.Desc,
            'meta.likes': ESortType.Desc,
        }
    }

    /**
     * 获取热门文章
     * @returns
     * @memberof ArticleService
     */
    public getHotArticleLists(): Promise<Article | any> {
        return this.hotArticleListCache()
    }

    /**
     * 保存文章
     * @param {Article} article
     * @returns {(Promise<Article | any>)}
     * @memberof ArticleService
     */
    async create(article: Article): Promise<Article | any> {
        const data = await this.findArticleInfo(article.title)
        if (data) {
            return { msg: '标题已存在' }
        }
        article.t_content = article.content
        return new this.articleModel(article).save().then((res) => {
            return res
        }).catch((err) => {
            return { msg: '保存失败' }
        })
    }

    /**
     * 根据ID更新文章
     * @param {Types.ObjectId} articleId
     * @param {Article} newArticle
     * @returns {Promise<Article>}
     * @memberof ArticleService
     */
    public update(articleId: Types.ObjectId, newArticle: Article): Promise<Article> {
        Reflect.deleteProperty(newArticle, 'meta')
        Reflect.deleteProperty(newArticle, 'create_at')
        Reflect.deleteProperty(newArticle, 'update_at')
        newArticle.t_content = newArticle.content
        return this.articleModel.findByIdAndUpdate(articleId, newArticle, { new: true }).exec().then((article) => {
            return article
        })
    }

    /**
     * 查询文章
     * @param {*} query
     * @param {*} params
     * @returns {(Promise<Article[] | any>)}
     * @memberof ArticleService
     */
    getArticle(query, params): Promise<PaginateResult<Article>> {
        params.populate = ['tags']
        params.select = '-password -content'
        return this.articleModel.paginate(query, params).then((articles) => {
            return articles
        })
    }

    /**
     * 根据title单个文章信息
     * @param {*} title
     * @returns {(Promise<Article | any>)}
     * @memberof ArticleService
     */
    findArticleInfo(title): Promise<Article | any>  {
        return this.articleModel.findOne({ title }).exec()
    }

    /**
     * 根据id获取文章信息
     * @param {Types.ObjectId} _id
     * @returns {(Promise<Article | any>)}
     * @memberof ArticleService
     */
    findByIdActicle(_id: Types.ObjectId): Promise<Article | any> {
        return this.articleModel.findById(_id).select('-password').populate({ path: 'tags', select: '_id' }).exec()
    }

    /**
     * 前端页面访问页面文章详情
     * @param {Types.ObjectId} _id
     * @returns {(Promise<Article | any>)}
     * @memberof ArticleService
     */
    getFullDetailArticle(_id: Types.ObjectId): Promise<Article> {
        return this.findByIdActicle(_id).then((article) => {
            if (!article) {
                return { msg: '文章不存在' }
            }
            article.meta.views++
            article.save()
            return article
        })
    }

    /**
     * 批量修改
     * @param {Types.ObjectId[]} ids
     * @param {EPublishState} state
     * @returns {Promise<Article[]>}
     * @memberof ArticleService
     */
    batchModify(ids: Types.ObjectId[], state: EPublishState): Promise<any> {
        return this.articleModel.updateMany({ _id: { $in: ids } }, { $set: { state } }, { multi: true })
            .exec()
            .then((result) => {
                return result
            })
    }

    /**
     * 批量删除
     * @param {DelActicles} ids
     * @returns {Promise<any>}
     * @memberof ArticleService
     */
    delete(ids: DelActicles): Promise<any> {
        return this.articleModel.find({ _id: { $in: ids } }).exec()
        .then(() => {
            return this.articleModel.deleteMany({ _id: { $in: ids } }).exec().then((reslut) => {
                return reslut
            })
        })
    }

}
