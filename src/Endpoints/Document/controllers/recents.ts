import { NextFunction, Request, Response } from 'express';
import pool from '../../../Database/db';
import { REQUEST_WITH_USER } from '../../User/Models';
import { STATUS } from '../../../config';
import { log } from 'console';


export const getRecents = async (req: Request, res: Response, next:NextFunction) => {

    const request = <REQUEST_WITH_USER>req
    
    const user = request.user._id   

    try {

        const recents = await pool.query({
            text: ` SELECT _id, title, description, name, size, created_at, updated_at, ext
FROM (
  SELECT
    docs.*,
    ROW_NUMBER() OVER (PARTITION BY user_docs.doc_id ORDER BY user_docs.created_at) AS rn
  FROM user_docs
  LEFT JOIN documents docs ON docs._id = user_docs.doc_id
  WHERE user_docs.user_id = $1
) AS subquery
WHERE rn = 1;`,
            values: [user]
        });



        return res.status(STATUS.OK).json({
            code: "RECENT_DOCUMENTS_FOUND",
            message:"Available Recent Documents",
            data:recents.rows
        })
        
    } catch (error) {   
        const err = <Error>error
        return next(err);          
    }

    
}