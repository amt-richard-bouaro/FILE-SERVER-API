import request from 'supertest';
import app from '../app'; 
import { Server } from 'http'; 
import cors, { CorsOptions, } from 'cors';
import express from 'express'
import supertest = require('supertest');
import { SERVER_CONFIG } from '../config';

let server: Server;

// beforeAll((done) => {
//   server = app.listen(5010, () => {
//     console.log('Express server started on port 5010');
//     done();
//   });
// });

// afterAll((done) => {
//   server.close(() => {
//     console.log('Express server closed');
//     done();
//   });
// });

const user = {
  _id:'7f75c448-3e23-49be-ab4b-67fce3d23787',
  surname: 'User',
  other_name: 'Example',
  email: 'user@example.com',
  role: 'admin'
    // Add other properties as needed
  };

describe('Test API endpoints', () => {

  
  it('should respond with status 200 for GET /api', async () => {
    const response = await request(app)
      .get('/api')
    expect(response.statusCode).toBe(200);
  });

  it('should respond with status 401 - UNATHORIZED  for GET /api/users with token', async () => {
    const response = await request(app)
      .get('/api/users')
    expect(response.statusCode).toBe(401);
  });

  it('should respond with status 404 for non-existing endpoint', async () => {
    const response = await request(app).get('/non-existing');
    expect(response.statusCode).toBe(404);
  });
});



// describe('Test Cors', () => {
//   it('should allow requests from allowed origins', async () => {
//     // const allowedOrigins = ['http://localhost:5000', 'http://localhost:3000'];
    
//     const corsOptions: CorsOptions = {
//       origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
//         if (SERVER_CONFIG.ALLOWED_ORIGINS.includes(origin || '')) {
//           callback(null, true);
//         } else {
//           callback(null, false);
//         }
//       },
//       credentials: true,
//     };

  
//     // app.use(cors(corsOptions));
    
//     // const request = supertest(app);

//     // await request(app)
//     //   .get('/api')
//     //   .set('Origin', 'http://localhost:5000')
//     //   .expect(200)
   

//     await request(app)
//       .get('/')
//       .set('Origin', 'http://localhost:3000')
//       .expect(200);

//     await request(app)
//       .get('/')
//       .set('Origin', 'http://localhost:5010')
//       .expect(403);
    
//      await request(app)
//       .get('/')
//       .set('Origin', 'http://localhost:8080')
//       .expect(403);
//   });



// });