import { UserCategory } from '../user.interface'

export default class CreateDto {
    readonly account: string
    readonly password: string
    readonly category: UserCategory
}