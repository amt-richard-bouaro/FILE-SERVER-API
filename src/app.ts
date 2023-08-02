import dotenv from 'dotenv';

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


// app.use(express.json());
// app.use(cookieParser());



const PORT = SERVER_CONFIG.PORT;






app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
   
})

export default app