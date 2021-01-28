/*
 * @Author: your name
 * @Date: 2019-07-10 17:02:39
 * @LastEditTime: 2021-01-25 17:25:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /nest-service/src/main.ts
 */
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as rateLimit from 'express-rate-limit'
import * as compression from 'compression'
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor'
import { TransformInterceptor } from '@app/interceptors/transform.interceptor'
import { ErrorInterceptor } from '@app/interceptors/error.interceptor'
import { HttpExceptionFilter } from '@app/filters/error.filter'
import { TimeoutInterceptor } from '@app/interceptors/timeout.interceptor'
import { ValidationPipe } from '@app/pipes/validation.pipe'

// 通过pm2 开启集群
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(compression())
  app.use(bodyParser.json({ limit: '1mb' }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }))
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors( // 全局拦截器
    new TransformInterceptor(new Reflector()),  // 响应拦截
    new ErrorInterceptor(new Reflector()),
    new TimeoutInterceptor(),
    new LoggingInterceptor(),
  )
  await app.listen(3000)
}
bootstrap().then(() => {
  console.log('监听3000已启用')
})
