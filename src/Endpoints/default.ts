import { log } from 'console';
import express, {Request, Response} from 'express';

const app = express.Router();

/**
 * @openapi
 * /api:
 *   get:
 *     tags:
 *       - API Info
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/', async (req:Request, res:Response) => { 
    try {

        // console.log(process.memoryUsage);
    
        return res.status(200).send(process.memoryUsage())

    } catch (error) {
        console.log(error);
        
    }
})




export default app;