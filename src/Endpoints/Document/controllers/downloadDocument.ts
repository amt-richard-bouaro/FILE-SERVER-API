import { NextFunction, Request, Response } from "express";

import { STATUS } from "../../../config";
import pool from "../../../Database/db";
import { REQUEST_WITH_USER } from "../../User/Models";
import { getFile } from "../../../utils/s3";
import { Readable } from "stream";



export const downloadDocuments = async (req: Request, res: Response<{ code: string, message: string, type: 'error' | 'success', data?: any[] | {} | null }>, next: NextFunction) => {
  const request = <REQUEST_WITH_USER>req
  const docID = req.params._id;
  const user = request.user

  try {

    const query = await pool.query({
      text: 'SELECT * FROM documents WHERE _id = $1',
      values: [docID]
    });


    if (query.rowCount > 0) {

      const key = query.rows[0].name;

      const buffer = await getFile(key);

    

      if (buffer instanceof Buffer) {
            
        const readableStream = Readable.from(buffer);
    

        res.setHeader('Content-Type', query.rows[0].mime_type);
        res.setHeader('Content-Disposition', `attachment; filename=${key}`);

         
        const checkDownloader = await pool.query({
        text: `SELECT * FROM user_docs WHERE doc_id = $1 AND user_id = $2 AND via = 'download'`,
        values: [docID, user._id]
        });


        if (checkDownloader.rowCount === 0) {

           await pool.query({
            text: 'UPDATE documents SET downloaded_count = downloaded_count + 1 WHERE _id = $1',
            values: [docID],
           });
          
          const via = 'download';

          await pool.query({
            text: 'INSERT INTO user_docs (user_id, doc_id, via) VALUES ($1, $2, $3)',
            values: [user._id, docID, via],
          });
          
        }
 
        readableStream.pipe(res)

    

      } else {
      return res.status(STATUS.NOT_FOUND).json({
        code: "DOCUMENT_NOT_FOUND",
        message: "No document matches the parameter specified",
        type: 'error'
      })

    }    

    } else {
      return res.status(STATUS.NOT_FOUND).json({
        code: "DOCUMENT_NOT_FOUND",
        message: "No document matches the parameter specified",
        type: 'error'
      })

    }

  } catch (error) {
    const err = <Error>error;
    next(err);
  }

}