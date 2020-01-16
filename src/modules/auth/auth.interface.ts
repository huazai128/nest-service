export interface JwtPayload {
    readonly account: string
    readonly exp?: number
}
