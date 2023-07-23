import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";

export const getDocuments = async (req:Request, res:Response, next:NextFunction) => {

    try {

        const query = await pool.query({
            text: 'SELECT * FROM documents ORDER BY created_at DESC',
            values:[]
        })

        return res.status(STATUS.OK).json({
            code: "DOCUMENTSFETCHED",
            message:"Available Documents",
            data:query.rows
        })
        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}