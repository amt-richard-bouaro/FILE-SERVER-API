import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { STATUS } from "../../../config";
import pool from "../../../Database/db";


export const downloadDocuments = async (req: Request, res: Response, next: NextFunction) => {
    
    const docID = req.params._id;
    
    try {

        const query = await pool.query({
            text: 'SELECT * FROM documents WHERE _id = $1',
            values: [docID]
        });   
        
        if (query.rowCount > 0) { 
            fs.access(query.rows[0].location, fs.constants.F_OK, (err) => {
            if (err) {
                res.status(404)
                throw new Error('Error: file not found: ' + query.rows[0].location);
            }
        });

        res.setHeader(`Content-Disposition`, `attachment; filename="${query.rows[0].name}"`);

        res.setHeader('Content-Type', `${query.rows[0].mime_type}`);

        const fileStream = fs.createReadStream(query.rows[0].location);

        fileStream.pipe(res);

        
        // return res.status(STATUS.OK).json({
        //     code: "DOCUMENTSFETCHED",
        //     message:"Available Documents",
        //     data:null
        // })

        }
         
    
        return res.status(STATUS.NOT_FOUND).json({
            code: "DOCUMENT_NOT_FOUND",
            message:"No document matches the parameter specified",
            data:null
        })
          
        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}