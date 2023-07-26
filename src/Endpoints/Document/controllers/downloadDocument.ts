import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { STATUS } from "../../../config";
import pool from "../../../Database/db";
import { REQUEST_WITH_USER } from "../../User/Models";


export const downloadDocuments = async (req: Request, res: Response, next: NextFunction) => {
    const request = <REQUEST_WITH_USER>req
    const docID = req.params._id;
    const user = request.user
    
    try {

        const query = await pool.query({
            text: 'SELECT * FROM documents WHERE _id = $1',
            values: [docID]
        }); 
        
        console.log(query.rowCount);
        
        
        if (query.rowCount > 0) {
            
             const fileLocation = query.rows[0].location;
             const fileName = query.rows[0].name;
            const mimeType = query.rows[0].mime_type;
           
            
       fs.access(fileLocation, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({
          code: 'FILE_NOT_FOUND',
          message: `File not found: `,
          data: null,
        });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
           console.log(query.rows[0].mime_type);
           
      res.setHeader('Content-Type', mimeType);

      const fileStream = fs.createReadStream(fileLocation);

      fileStream.on('error', (err) => {
        return res.status(500).json({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error while processing the file.',
          data: null,
        });
      });

      fileStream.on('end', async () => {
        const updateDownloadCountQuery = await pool.query({
          text: 'UPDATE documents SET downloaded_count = downloaded_count + 1 WHERE _id = $1',
          values: [docID],
        });

        const via = 'download';
        const createUserDocRecord = await pool.query({
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
            data:null
        }) 

        }
           
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}