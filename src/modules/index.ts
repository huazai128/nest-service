/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 14:47:48
 * @LastEditTime: 2021-01-26 17:20:53
 * @LastEditors: Please set LastEditors
 */
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { TagModule } from './tag/tag.module'
import { ArticleModule } from './article/article.module'
import { ExpansionModule } from './expansion/expansion.module'
import { UplaodModule } from './upload/upload.module'
import { TaskModule } from './task/task.module'
import { CardModule } from './card/card.module'

export default [
    UserModule,
    AuthModule,
    TagModule,
    ArticleModule,
    ExpansionModule,
    UplaodModule,
    TaskModule,
    CardModule,
]