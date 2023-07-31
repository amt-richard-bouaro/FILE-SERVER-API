import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { STATUS } from "../../../config";
import pool from "../../../Database/db";
import { REQUEST_WITH_USER } from "../../User/Models";
import { mailOptions, sendMail } from "../../../utils/email";
import { emailDocument } from "../../../utils/mailTemplate";


export const emailDocuments = async (req: Request, res: Response, next: NextFunction) => {
    const request = <REQUEST_WITH_USER>req
    const docID = req.params._id;
    const user = request.user

    try {

        const query = await pool.query({
            text: 'SELECT * FROM documents WHERE _id = $1',
            values: [docID]
        });

        console.log(query.rowCount);


        if (query.rowCount < 1) {
            return res.status(STATUS.NOT_FOUND).json({
                code: "DOCUMENT_NOT_FOUND",
                message: "No document matches the parameter specified",
                type: 'error'
            })

        }




            const attachmentPath = query.rows[0].location;

            const attachment = fs.readFileSync(attachmentPath);

            sendMail(mailOptions({
                to: user.email,
                subject: 'Document Request',
                html: emailDocument(user.surname),
                attachments: [
                    {
                        filename: query.rows[0].name,
                        content: attachment,
                    },
                ],
            }));

            await pool.query({
                text: 'UPDATE documents SET emailed_count = emailed_count + 1 WHERE _id = $1',
                values: [docID]
            });
            const via = 'email'
            await pool.query({
                text: 'INSERT INTO user_docs (user_id, doc_id, via) VALUES ($1, $2, $3)',
                values: [user._id, docID, via],
            });



            return res.status(STATUS.OK).json({
                code: "DOCUMENT_SENT_TO_MAIL",
                message: `Document has been sent to ${user.email}`,
                type: 'success',
            })


    } catch (error) {
        const err = <Error>error;
        next(err);
    }

}