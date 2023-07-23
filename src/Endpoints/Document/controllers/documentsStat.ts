import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";

export const getDocumentsStats = async (req: Request, res: Response, next: NextFunction) => {
    

    try {

        const findAvgFileSize = await pool.query({
            text: 'SELECT ROUND(AVG(size), 0) as avg_file_size FROM documents',
            values: []
        });

        return res.status(STATUS.OK).json({
            code: "DOCUMENTSFETCHED",
            message:"Available Documents",
            data:findAvgFileSize.rows[0]
        })
        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}