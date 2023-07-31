import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerDocs from './utils/swagger';
dotenv.config();
import createServer from './utils/server';
import { SERVER_CONFIG } from './config';


const app = createServer();

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (origin && SERVER_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(null, false);
//       }
//     },
//     credentials: true,
//   })
// );

// // app.use(cors());
// app.use(express.json());
// app.use(cookieParser());



const PORT = SERVER_CONFIG.PORT;






app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
   
})

export default app