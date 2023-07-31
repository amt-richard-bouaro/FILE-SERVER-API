import { Pool } from 'pg';
import { DB_CONFIG } from '../config';

// const pool = new Pool({
//     host: DB_CONFIG.HOST,
//     database: DB_CONFIG.DATABASE,
//     port: parseInt(DB_CONFIG.PORT),
//     user: DB_CONFIG.USER,
//     password: DB_CONFIG.PASSWORD
// });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

pool.connect(err => {
    if (err) {
        throw err;
    }

    console.log('Connect to database successfully');
    
})


// 
export default pool;