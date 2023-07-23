import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";


export const getDocument = async (req: Request, res: Response<{ code: string, message: string, data: any[] | {} |null}>, next: NextFunction) => {

    const docID = req.params._id;
    
    try {

        const query = await pool.query({
            text: 'SELECT * FROM documents WHERE _id = $1',
            values:[docID]
        })

        if (query.rowCount < 1) {
            return res.status(STATUS.OK).json({
            code: "NODOCUMENTFOUND",
            message: "0 documents found",
            data: null
        });
        }

        return res.status(STATUS.OK).json({
            code: "DOCUMENTFOUND",
            message: "1 documents found",
            data: query.rows[0]
        });

        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }
    
}