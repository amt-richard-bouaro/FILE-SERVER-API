import { NextFunction, Request, Response } from "express";
import pool from "../../../Database/db";
import { STATUS } from "../../../config";
import { SEARCH_STRING } from "../Models";

export const searchDocuments = async (req: Request, res: Response, next: NextFunction) => {

    const { search } = req.body;

    try {

        SEARCH_STRING.parse(search);

        const query = await pool.query({
            text: `SELECT* 
 FROM documents
 WHERE title ILIKE '%${search}%' OR title ILIKE '%${search}' OR title ILIKE '${search}%' OR title ILIKE '${search}' 
 OR description ILIKE '%${search}%' OR description ILIKE '%${search}' OR description ILIKE '${search}%' OR description ILIKE '${search}'
 OR name ILIKE '%${search}%' OR name ILIKE '%${search}' OR name ILIKE '${search}%' OR name ILIKE '${search}' ORDER BY title, description, name, updated_at DESC`,
            values: []
        });

        return res.status(STATUS.OK).json({
            code: "DOCUMENTS_MATCHED",
            message: "Available Documents that match the search",
            data: query.rows
        });

    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}