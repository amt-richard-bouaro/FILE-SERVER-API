import { NextFunction, Request, Response } from "express";

import { STATUS } from "../../../config";
import pool from "../../../Database/db";
import { REQUEST_WITH_USER } from "../../User/Models";
import { mailOptions, sendMail } from "../../../utils/email";
import { emailDocument } from "../../../utils/mailTemplate";
import { getFile } from "../../../utils/s3";


export const emailDocuments = async (req: Request, res: Response, next: NextFunction) => {
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

      getFile(key).then( async (file) => { 

        if (file instanceof Buffer) { 

            sendMail(mailOptions({
                to: user.email,
                subject: 'Document Request',
                html: emailDocument(user.surname),
                attachments: [
                    {
                        filename: query.rows[0].name,
                        content: file,
                    },
                ],
            }));
          
        const checkUserRequesting = await pool.query({
        text: `SELECT * FROM user_docs WHERE doc_id = $1 AND user_id = $2 AND via = 'email'`,
        values: [docID, user._id]
        });
          
          if (checkUserRequesting.rowCount === 0) { 

              await pool.query({
                text: 'UPDATE documents SET emailed_count = emailed_count + 1 WHERE _id = $1',
                values: [docID]
            });
            const via = 'email'
            await pool.query({
                text: 'INSERT INTO user_docs (user_id, doc_id, via) VALUES ($1, $2, $3)',
                values: [user._id, docID, via],
            });

          }
            return res.status(STATUS.OK).json({
                code: "DOCUMENT_SENT_TO_MAIL",
                message: `Document has been sent to ${user.email}`,
                type: 'success',
            })

  
      } else {
      return res.status(STATUS.NOT_FOUND).json({
        code: "DOCUMENT_NOT_FOUND",
        message: "No document matches the parameter specified",
        type: 'error'
      })

    }

      }).catch((err) => { 

        console.log(err);
        
        return res.status(STATUS.NOT_FOUND).json({
        code: "DOCUMENT_NOT_FOUND",
        message: "No document matches the parameter specified",
        type: 'error'
      })

      });

      

     

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