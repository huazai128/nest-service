/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 14:04:18
 * @LastEditTime: 2019-10-05 23:10:36
 * @LastEditors: Please set LastEditors
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { CorsMiddlemares } from '@app/middlewares/cors.middlemares'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypegooseModule } from 'nestjs-typegoose'
import modules from '@app/modules'
import { HelperModule } from '@app/processors/helper/helper.module'
import { CacheModule } from '@app/processors/cache/cache.module'
@Module({
    imports: [
        TypegooseModule.forRoot('mongodb://localhost:27017/nest', {
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
        }),
        HelperModule,
        CacheModule,
        ...modules
    ],
    controllers: [AppController],
    providers: [ AppService ],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
		.apply(CorsMiddlemares)
		.forRoutes('*')
	}
}
