import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";


/**
 * @openapi
 * components:
 *   schemas:
 *     Documents:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Document'
 */
export const getDocuments = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {
    
    try {

        const query = await pool.query({
            text: 'SELECT _id, name, title, description, size,downloaded_count, emailed_count,created_at, updated_at, ext FROM documents ORDER BY updated_at DESC',
            values:[]
        })

        return res.status(STATUS.OK).json({
            code: "DOCUMENTS",
            message: "Available Documents",
            type: "success",
            data:query.rows
        })
        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}