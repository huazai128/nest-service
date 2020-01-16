/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:20:21
 * @LastEditTime: 2019-10-29 11:01:30
 * @LastEditors: Please set LastEditors
 */
import * as _mongoose from 'mongoose'
import * as _mongoosePaginate from 'mongoose-paginate'
import * as _mongooseAutoIncrement from 'mongoose-auto-increment'

// 各种 Hack
_mongoose.set('useFindAndModify', false);
(_mongoose as any).Promise = global.Promise

_mongooseAutoIncrement.initialize(_mongoose.connection);

// 插件配置初始化
(_mongoosePaginate as any).paginate.options = {
  limit: 20,
}

export const mongoose = _mongoose
export const mongoosePaginate = _mongoosePaginate
export const mongooseAutoIncrement = _mongooseAutoIncrement
export default mongoose
