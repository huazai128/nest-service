/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 16:04:42
 * @LastEditTime: 2019-10-28 17:49:11
 * @LastEditors: Please set LastEditors
 */
import { PaginateModel, Document } from 'mongoose'

export type TMongooseModel<T> =  PaginateModel<T & Document>