export type UserCategory = 'user' | 'admin'

export interface IUser {
    updatedAt: Date
    createdAt: Date
    account: string
    password: string
    category: UserCategory
}
