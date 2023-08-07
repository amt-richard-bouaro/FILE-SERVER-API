import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";

import { deleteObject } from "../../../utils/s3";


export const destroyDocument = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {

    const docID = req.params._id;

    try {

        const query = await pool.query({
            text: 'DELETE FROM documents WHERE _id = $1 RETURNING _id, name, title, description,size,downloaded_count, ext, emailed_count,created_at, updated_at',
            values: [docID]
        });

        if (query.rowCount < 1) {
            return res.status(STATUS.BAD_REQUEST).json({
                code: "NO_DOCUMENT_DESTROYED",
                message: "0 documents destroyed",
                type: "error"
            });
        }

        const key = query.rows[0].name;
        const { _id,
          name,
          title,
          description,
          user_id,
          size,
          downloaded_count,
          emailed_count,
          created_at,
          updated_at,
          ext,
          location,
          mime_type } = query.rows[0];


        deleteObject(key).then(async (code) => {

            if (code === 204) {

                return res.status(STATUS.OK).json({
                    code: "DOCUMENT_DESTROYED",
                    message: "1 documents destroyed",
                    type: "success",
                    data: {
                        _id,
                        name,
                        title,
                        description,
                        size,
                        downloaded_count, 
                        emailed_count,
                        created_at,
                        updated_at,
                        ext
                    }
                });

            } else {

                //  await pool.query({
                //     text: 'INSERT INTO documents (_id, name, title, description, user_id, location, size,downloaded_count, emailed_count,created_at, updated_at, mime_type, ext) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11, $12,$13)',
                //     values: [_id, name, title, description, user_id, location, size, downloaded_count, emailed_count, created_at, updated_at, mime_type, ext]
                // });

                return res.status(STATUS.BAD_REQUEST).json({
                code: "NO_DOCUMENT_DESTROYED",
                message: "0 documents destroyed",
                type: "error"
            });

            }

        }).catch(error => {
            console.log(error);

            return res.status(STATUS.BAD_REQUEST).json({
                code: "NO_DOCUMENT_DESTROYED",
                message: "0 documents destroyed",
                type: "error"
            });
        })


    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}
