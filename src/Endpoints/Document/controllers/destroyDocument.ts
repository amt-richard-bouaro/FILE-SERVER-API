import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";
import fs from "fs";


export const destroyDocument = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {

    const docID = req.params._id;

    try {

        const query = await pool.query({
            text: 'DELETE FROM documents WHERE _id = $1 RETURNING _id, name, title, description,size,downloaded_count,location, ext, emailed_count,created_at, updated_at',
            values: [docID]
        });
        
        if (query.rowCount < 1) {
            return res.status(STATUS.BAD_REQUEST).json({
                code: "NO_DOCUMENT_DESTROYED",
                message: "0 documents destroyed",
                type: "error"
            });
        }

        const destroyDocLoc = query.rows[0].location;

        fs.unlink(destroyDocLoc, async (err) => {
            if (err) {
                // console.log(err);
                let doc = query.rows[0];
                await pool.query({
                    text: 'INSERT INTO documents (_id, name, title, description, user_id, location, size,downloaded_count, emailed_count,created_at, updated_at, mime_type, ext) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11, $12,$13)',
                    values: [doc._id, doc.name, doc.title, doc.description, doc.user_id, doc.location, doc.size, doc.downloaded_count, doc.emailed_count, doc.created_at, doc.updated_at, doc.mime_type, doc.ext]


                });

                
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                code: "DOCUMENT_DESTROY_FAILED",
                message: "document could not be destroyed",
                type:'error'
                });
        

            } else {


                const { _id, name, title, description, user_id, size, downloaded_count, emailed_count, created_at, updated_at, ext } = query.rows[0];

                return res.status(STATUS.OK).json({
                    code: "DOCUMENT_DESTROYED",
                    message: "1 documents destroyed",
                    type: "success",
                    data: {
                        _id, name, title, description, user_id, size, downloaded_count, emailed_count, created_at, updated_at, ext
                    }
                });

            }
        });

    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}