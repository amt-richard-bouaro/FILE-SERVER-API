import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { STATUS } from "../../../config";
import pool from "../../../Database/db";
import { REQUEST_WITH_USER } from "../../User/Models";


export const downloadDocuments = async (req: Request, res: Response<{ code: string, message: string,type: 'error'|'success', data?: any[] | {} | null }>, next: NextFunction) => {
    const request = <REQUEST_WITH_USER>req
    const docID = req.params._id;
    const user = request.user
    
    try {

        const query = await pool.query({
            text: 'SELECT * FROM documents WHERE _id = $1',
            values: [docID]
        }); 
        
        // console.log(query.rowCount);
        
        
        if (query.rowCount > 0) {
            
             const fileLocation = query.rows[0].location;
             const fileName = query.rows[0].name;
            const mimeType = query.rows[0].mime_type;
           
            // const {name, location, mime_type} = query.rows[0]
       fs.access(fileLocation, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(STATUS.NOT_FOUND).json({
          code: 'FILE_NOT_FOUND',
          message: `File not found: `,
          type: 'error',
        });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
          //  console.log(query.rows[0].mime_type);
           
      res.setHeader('Content-Type', mimeType);

      const fileStream = fs.createReadStream(fileLocation);

      fileStream.on('error', (err) => {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while processing the file.',
          type: 'error',
        });
      });

      fileStream.on('end', async () => {
        await pool.query({
          text: 'UPDATE documents SET downloaded_count = downloaded_count + 1 WHERE _id = $1',
          values: [docID],
        });

        const via = 'download';

        await pool.query({
          text: 'INSERT INTO user_docs (user_id, doc_id, via) VALUES ($1, $2, $3)',
          values: [user._id, docID, via],
        });
      });

      fileStream.pipe(res); 
    }); 
                    
        } else {
           return res.status(STATUS.NOT_FOUND).json({
            code: "DOCUMENT_NOT_FOUND",
            message:"No document matches the parameter specified",
            type:'error'
        }) 

        }
           
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}