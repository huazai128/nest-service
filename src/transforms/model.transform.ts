/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-19 14:55:30
 * @LastEditTime: 2019-09-02 18:56:08
 * @LastEditors: Please set LastEditors
 */
import { Connection } from 'mongoose'
import { Provider, Inject } from '@nestjs/common'
import { Typegoose, GetModelForClassOptions, ModelType } from 'typegoose'
import { DB_MODEL_TOKEN_SUFFIX, DB_CONNECTION_TOKEN } from '@app/constants/sys.constant'

type TypegooseClass<T extends Typegoose> = new (...args: any[]) => T

export function getModelToken(modelName: string): string {
    return modelName + DB_MODEL_TOKEN_SUFFIX
  }

// 根据 Typegoose 获取 Model
export function getModelBySchema<T extends Typegoose>(typegooseClass: TypegooseClass<T>, schemaOptions: GetModelForClassOptions = {}): ModelType<T> {
    return new typegooseClass().getModelForClass(typegooseClass, schemaOptions)
}

// 根据 Model 获取 Provider
export function getProviderByModel<T>(model: ModelType<T>): Provider<T> {
    return {
      provide: getModelToken(model.modelName),
      useFactory: (connection: Connection) => model,
      inject: [DB_CONNECTION_TOKEN],
    }
  }

  // 根据 Typegoose 获取 Provider（会重复实例 Model，不建议使用）
export function getProviderBySchema<T extends Typegoose>(
    typegooseClass: TypegooseClass<T>,
    schemaOptions: GetModelForClassOptions = {},
): Provider<T> {
    return getProviderByModel(
        getModelBySchema(typegooseClass, schemaOptions),
    )
}

// 注入器
export function InjectModel<T extends Typegoose>(model: TypegooseClass<T>) {
    return Inject(getModelToken(model.name))
}