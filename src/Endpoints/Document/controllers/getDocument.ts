import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";

/**
 * @openapi
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         name:
 *           type: string
 *         downloaded_count:
 *           type: number
 *         emailed_count:
 *           type: number
 *         size:
 *           type: number
 *         ext:
 *           type: string
 *         created_at:
 *           type: string
 *         updated_at:
 *           type: string
 */
export const getDocument = async (req: Request, res: Response<{ code: string, message: string,type:'error'|'success', data?: any[] | {} |null}>, next: NextFunction) => {

    const docID = req.params._id;
    
    try {

        const query = await pool.query({
            text: 'SELECT _id, name, title, description, size,downloaded_count, emailed_count,ext,created_at,updated_at FROM documents WHERE _id = $1',
            values:[docID]
        })

        if (query.rowCount < 1) {
            return res.status(STATUS.BAD_REQUEST).json({
            code: "NO_DOCUMENT_FOUND",
            message: "0 documents found",
            type: "error"
        });
        }

        return res.status(STATUS.OK).json({
            code: "DOCUMENT",
            message: "Document requested",
            type: "success",
            data: query.rows[0]
        });

        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }
    
}