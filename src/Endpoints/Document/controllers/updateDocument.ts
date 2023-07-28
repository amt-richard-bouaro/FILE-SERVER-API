import { v4 as uuidv4 } from 'uuid'
import { DOC_INFO } from './../Models';
import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../../../config';
import pool from '../../../Database/db';



export const updateDocument = async (req: Request<{ _id: string }, {}, DOC_INFO>, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {

    const incomingDocInfo = req.body;
    const docID = req.params._id;

    try {

        DOC_INFO.parse(incomingDocInfo);

        const query = await pool.query({
            text: `UPDATE documents set title = CASE WHEN SUBSTRING($2 FROM 1 FOR 10) like LEFT(title, 10) THEN $2 ELSE LEFT(title, 10) || $2 END, description = $3 WHERE _id = $1 RETURNING _id, name, title, description, size,downloaded_count, emailed_count,created_at, updated_at, ext`,
            values: [docID, incomingDocInfo.title, incomingDocInfo.description]
        });

        if (query.rowCount < 1) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            code: "DOCUMENT_MODIFIED",
            message: 'Something went wrong with the query',
            type: 'error'
        });
        }

        return res.status(STATUS.ACCEPTED).json({
            code: "DOCUMENT_MODIFIED",
            message: 'Document information was updated successfully',
            type: 'success',
            data:query.rows[0]
        });
    } catch (error) {

        const err = <Error>error;
        next(err);
    }
}






