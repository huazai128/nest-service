/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-05 21:40:13
 * @LastEditTime: 2019-10-25 14:42:10
 * @LastEditors: Please set LastEditors
 */
import { CacheModule as NestCacheModule, Module, Global } from '@nestjs/common'
import { CacheConfigService } from './cache.config.service'
import { CacheService } from './cache.service'

@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            useClass: CacheConfigService,
            inject: [CacheService],
        })
    ],
    providers: [CacheConfigService, CacheService],
    exports: [CacheService],
})
export class CacheModule {}