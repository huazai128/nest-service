/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-11 15:15:38
 * @LastEditTime: 2019-11-07 11:52:40
 * @LastEditors: Please set LastEditors
 */
import { prop, Typegoose } from '@typegoose/typegoose'
import { IsString, IsDefined, IsNotEmpty } from 'class-validator'
import { getProviderByModel, getModelBySchema } from '@app/transforms/model.transform'

export class User extends Typegoose {
    @IsDefined()
    @IsString({message: '名字'})
    @prop({ default: '' })
    name: string

    @IsDefined()
    @IsString({message: '账号'})
    @prop({ default: '' })
    account: string

    @prop({ required: true })
    password: string
}

export class UserLogin extends Typegoose {
    @IsDefined()
    @IsNotEmpty({ message: '密码密码不能为空哟' })
    @IsString({ message: '字符串' })
    password: string
}

// export const UserModel = getModelBySchema(User)
// export const UserProvider = getProviderByModel(TagModel)