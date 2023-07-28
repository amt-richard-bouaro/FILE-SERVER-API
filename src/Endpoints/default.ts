import express, {Request, Response} from 'express';

const app = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Error_Response:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         type:
 *           type: string
 *           default: error
 *     Validation_Error_Response:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         type:
 *           type: string
 *           default: error
 *         error:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               validation:
 *                 type: string
 *               message:
 *                 type: string
 *               path:
 *                 type: array
 *                 items:
 *                   type: string
 */
app.get('/', async (req:Request, res:Response) => { 
    try {  
        return res.status(200).send(process.memoryUsage())

    } catch (error) {
        console.log(error);
        
    }
})




export default app;