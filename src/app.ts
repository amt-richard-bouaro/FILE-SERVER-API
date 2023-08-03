import dotenv from 'dotenv';

dotenv.config();
import createServer from './utils/server';
import { SERVER_CONFIG } from './config';


const app = createServer();

const PORT = SERVER_CONFIG.PORT;


app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
   
})

export default app