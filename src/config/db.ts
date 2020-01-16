const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 27017
const DB_NAME = process.env.DB_NAME || 'nest'

export const DATABASE_CONNECTION_TOKEN = 'DATABASE_CONNECTION_TOKEN'
export const LIMIT = 20
export const DB_CONN = `mongodb://@${DB_HOST}:${DB_PORT}/${DB_NAME}`
