import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";
import fs from "fs";


export const destroyDocument = async (req: Request, res: Response<{ code: string, message: string, data: any[] | {} | null }>, next: NextFunction) => {

    const docID = req.params._id;

    try {

        const query = await pool.query({
            text: 'DELETE FROM documents WHERE _id = $1 RETURNING *',
            values: [docID]
        });
        
        if (query.rowCount < 1) {
            return res.status(STATUS.OK).json({
                code: "NODOCUMENTDESTROYED",
                message: "0 documents destroyed",
                data: null
            });
        }

        const destroyDocLoc = query.rows[0].location;

        fs.unlink(destroyDocLoc, async (err) => {
            if (err) {
                // console.log(err);
                let doc = query.rows[0];
                const reInsertDoc = await pool.query({
                    text: 'INSERT INTO documents (_id, name, title, description, user_id, location, size,downloaded_count, emailed_count,created_at, updated_at) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
                    values: [doc._id, doc.name, doc.title, doc.description, doc.user_id, doc.location, doc.size, doc.downloaded_count, doc.emailed_count, doc.created_at, doc.updated_at]


                });

                if (query.rowCount < 1) {
                return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                code: "DOCUMENT_DELETED_NOT_DESTROYED",
                message: "document could not be destroyed",
                data:null
            });
        }

            } else {

                return res.status(STATUS.OK).json({
                    code: "DOCUMENTDESTROYED",
                    message: "1 documents destroyed",
                    data: query.rows[0]
                });

            }
        });

    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}