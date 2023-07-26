import {v4 as uuidv4} from 'uuid'
import { DOC_INFO, FILE_INFO } from './../Models';
import { NextFunction, Request, Response } from 'express'
import { STATUS } from '../../../config';
import pool from '../../../Database/db';
import { REQUEST_WITH_USER } from '../../User/Models';


export const upload = async (req:Request<{},{},DOC_INFO>, res:Response, next:NextFunction) => {
    
    const incomingDocInfo = req.body;
    const request = <REQUEST_WITH_USER>req
    const user = request.user


    try {

        DOC_INFO.parse(incomingDocInfo);

        let file:FILE_INFO;
        
        if (req.file) {
          
            const originalname = req.file.originalname;
            const nameParts = originalname.split('.');
            const ext = nameParts[nameParts.length - 1];
            file = {
                name: req.file.filename,
                size: req.file.size,
                location: req.file.path,
                mimeType: req.file.mimetype,
                ext
          }
        } else {
            res.status(STATUS.PARTIAL_CONTENT);
            throw new Error(`Error uploading file: Unsupported file type or file size exceeded or no file uploaded`);
        }

        const _id = uuidv4();

        const title = file.name.slice(0, 9) + ': ' + incomingDocInfo.title;

        const query = await pool.query({
            text: `INSERT INTO documents (_id, name, title, description, user_id, location, size, mime_type, ext) VALUES ($1, $2, $3, $4,$5,$6,$7, $8, $9) RETURNING *`,
            values: [_id, file.name,title, incomingDocInfo.description, user._id, file.location, file.size, file.mimeType, file.ext]
        });

        if (query.rowCount < 1) {
            res.status(STATUS.INTERNAL_SERVER_ERROR);
            throw new Error('Something went wrong with the query');
        }
            
        
        return res.status(STATUS.CREATED).send({
            code: "DOCUMENT_UPLOADED",
            message: "Document has been successfully uploaded",
            data:query.rows[0]
        });

      
    
    } catch (error) {
      
        const err = <Error>error;
        next(err);
    }
}






