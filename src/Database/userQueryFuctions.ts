import pool from "./db";


export const findUserByEmail = async <T extends {text:string, values:string[]}>(query:T) => {
 try {
    
     const user = await pool.query(query)
     return user.rows
     
 } catch (err) {
     console.error(err);
     throw err;
    
 }
}