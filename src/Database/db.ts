import { Pool } from 'pg';
import { DB_CONFIG } from '../config';

const devPool = new Pool({
    host: DB_CONFIG.HOST,
    database: DB_CONFIG.DATABASE,
    port: parseInt(DB_CONFIG.PORT),
    user: DB_CONFIG.USER,
    password: DB_CONFIG.PASSWORD
});

const proPool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})


const pool = process.env.NODE_ENV === "production" ? proPool : devPool;

pool.connect(err => {
    if (err) {
       console.log('...connecting to database');
    } else {
        console.log('Connected to database successfully');
    } 
})


// 
export default pool;