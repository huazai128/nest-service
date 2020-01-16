/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:07:43
 * @LastEditTime: 2019-09-02 18:58:10
 * @LastEditors: Please set LastEditors
 */
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import ServiceExt from '@app/utils/serviceExt'
import { TMongooseModel } from '@app/interfaces/mongoose.interface'
import logger from '@app/utils/logger'
import { cryptoData } from '@app/utils/common'
import CreateDto from './dto/create.dto'
import FindAllDto from './dto/findAll.dto'
import { User } from './user.model'
import { IUser } from './user.interface'

@Injectable()
export class UserService extends ServiceExt {
    constructor(
        @InjectModel(User) private readonly userModel: TMongooseModel<IUser>
    ) {
        super()
    }

    /**
     * 创建用户
     * @param user 用户实体
     */
    async createUser(user: CreateDto) {
        const { account, password } = user
        logger.error(user)
        if (!account || !password) {
            logger.error('输入的密码或者用户为空')
            return this.handleReturn({ data: null, code: 10001 })
        }
        const isUserExist = await this.isDocumentExist(this.userModel, { account })
        if (isUserExist) {
            return this.handleReturn({ data: null, code: 10002 })
        }
        const newUser = new this.userModel({
            ...user,
            password: cryptoData(password)
        })
        await newUser.save()
        return this.handleReturn({ data: {  }, code: 200 })
    }

    /**
     * 根据账号查询用户信息
     * @param account 账号
     */
    async findUserByAccount(account: string) {
        return this.userModel.findOne({ account }).select('account password')
    }

    async findAll(): Promise<IUser[] | null> {
        return await this.userModel.find().exec()
    }
}