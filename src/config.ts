export const SERVER_CONFIG = {
    PORT: process.env.PORT || 5050,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    ALLOWED_ORIGINS: [process.env.CLIENT_ORIGIN, 'http://localhost:5050','http://localhost:3000', 'https://file-server-api.vercel.app'],
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS || 'examples@example.com',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'somePassword'
}

export const S3_BUCKET = {
    REGION: process.env.AWS_BUCKET_REGION,
    NAME: process.env.AWS_BUCKET_NAME || '',
    ACCESS_KEY: process.env.AWS_ACCESS_KEY_ID || '',
    SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY  || '',
}

interface dbConfiguration {
    PORT: string ,
    HOST: string,
    DATABASE: string,
    USER: string,
    PASSWORD: string
}

export const DB_CONFIG: dbConfiguration = {
    PORT: process.env.DB_PORT || '5432',
    HOST: process.env.DB_HOST || 'localhost',
    DATABASE: process.env.DB_DATABASE || 'db_fs_test',
    USER: process.env.DB_USER || 'tester',
    PASSWORD: process.env.DB_PASSWORD || 'testing',
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