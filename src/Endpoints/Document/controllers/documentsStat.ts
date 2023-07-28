import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";


/**
 * @openapi
 * components:
 *   schemas:
 *     Document_Stats:
 *       type: object
 *       properties:
 *         folders:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               ext:
 *                 type: string
 *               count:
 *                 type: number
 *               total_count:
 *                 type: number
 *         performing:
 *           type: array
 *           items: 
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               downloaded_count:
 *                 type: number
 *               emailed_count:
 *                 type: number
 *               size:
 *                 type: number
 *               ext:
 *                 type: string
 *               created_at:
 *                 type: string
 *               updated_at:
 *                 type: string
 *               downloaded_emailed:
 *                 type: number
 *         avg_file_size: 
 *           type: number
 */
export const getDocumentsStats = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {
    

    try {

        const findAvgFileSize = await pool.query({
            text: 'SELECT ROUND(AVG(size), 0) as avg_file_size FROM documents',
            values: []
        });
        const analysisByExt = await pool.query({
            text: 'SELECT docs.ext, COUNT(docs.ext) as count, cast(SUM(size) as BIGINT) as total_size FROM documents docs GROUP BY docs.ext',
            values: []
        });
        const analysisByDownloadsEmail = await pool.query({
            text: ` SELECT docs._id, docs.title, docs.description,docs.downloaded_count, docs.emailed_count, docs.name, docs.size, docs.created_at, docs.updated_at, docs.ext , (docs.downloaded_count + docs.emailed_count) as downloaded_emailed
            FROM documents docs
           ORDER BY downloaded_emailed DESC
            LIMIT 20`,
            values: []
        });

        const folders = analysisByExt.rows
        const performing = analysisByDownloadsEmail.rows;
        const avg_file_size = findAvgFileSize.rows

        const data = {
            folders, performing, avg_file_size
        }

        return res.status(STATUS.OK).json({
            code: "DOCUMENTS_STATS",
            message: "Stats on available documents",
            type:'success',
            data
        })
        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}