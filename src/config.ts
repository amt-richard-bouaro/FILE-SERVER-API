export const SERVER_CONFIG = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    ALLOWED_ORIGINS: ['http://localhost:3000', 'http://localhost:5050'],
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || ''
}

interface dbConfiguration {
    PORT: string ,
    HOST: string,
    DATABASE: string,
    USER: string,
    PASSWORD: string
}

export const DB_CONFIG: dbConfiguration = {
    PORT: process.env.DB_PORT || '',
    HOST: process.env.DB_HOST || 'localhost',
    DATABASE: process.env.DB_DATABASE || 'test',
    USER: process.env.DB_USER || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || '',
}

interface status {
    OK: number,
    CREATED: number,
    ACCEPTED: number,
    NO_CONTENT: number,
    PARTIAL_CONTENT: number,
    NOT_MODIFIED: number,
    TEMPORARY_REDIRECT: number,
    BAD_REQUEST: number,
    UNAUTHORIZED: number,
    FORBIDDEN: number,
    NOT_FOUND: number,
    CONFLICT: number,
    INTERNAL_SERVER_ERROR: number,
    SERVICE_UNAVAILABLE: number
}

export const STATUS:status = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
}