/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 14:47:48
 * @LastEditTime: 2019-09-16 17:49:35
 * @LastEditors: Please set LastEditors
 */
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { TagModule } from './tag/tag.module'
import { ArticleModule } from './article/article.module'
import { ExpansionModule } from './expansion/expansion.module'

export default [
    UserModule,
    AuthModule,
    TagModule,
    ArticleModule,
    ExpansionModule
]