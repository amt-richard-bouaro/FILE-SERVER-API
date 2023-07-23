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
        
        fs.access(query.rows[0].location, fs.constants.F_OK, (err) => {
            if (err) {
                res.status(404)
                throw new Error('Error: file not found: ' + query.rows[0].location);
            }
        });

        res.setHeader(`Content-Disposition`, `attachment; filename="tut.jpg"`);

        res.setHeader('Content-Type', 'image/jpg');

        const fileStream = fs.createReadStream('src/Uploads/LCF-59764-wallpaperflare.com_wallpaper (2).jpg');

        fileStream.pipe(res);

        
        // return res.status(STATUS.OK).json({
        //     code: "DOCUMENTSFETCHED",
        //     message:"Available Documents",
        //     data:null
        // })
        
    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}