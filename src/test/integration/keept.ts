//   describe('GET /api/users/', () => {

//         describe('when the client is not authenticated', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const userID = '20932-ninc-32939-3niidl-2hde73v'

//                 await supertest(app)
//                     .get(`/api/users/${userID}`)
//                     .expect(401)
//             })
//         })

//         describe('when the client is authenticated but must change their password', () => {
//             it('should return status 403 - FORBIDDEN', async () => {

//                 const user = {
//                     _id: '0093d-maie9-32dsyd9-32323dl-ahde0393',
//                     surname: 'tester',
//                     other_names: 'check',
//                     role: 'admin',
//                     must_change_password: false
//                 }

//                 const user_must_pass = {
//                     _id: 'e3eed61f-a296-4273-ba0e-89dcdac2002d'
//                 }

//                 const token = jwt.sign(user_must_pass, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 await supertest(app)
//                     .get(`/api/users`)
//                     .set('Cookie', [`token=${token}`])
//                     .expect(403)


//             })
//         })

//         describe('when the client is authenticated and does not need to change their password & role is admin', () => {
//             it('should return status 200 - OK', async () => {


//                 const user = {
//                     _id: '1abd52de-d7b5-48e9-b03b-be56ab07eb2a'
//                 }

//                 const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 await supertest(app)
//                     .get(`/api/users`)
//                     .set('Cookie', [`token=${token}`])
//                     .expect(200)


//             })
//         })

//         describe('when the client is authenticated and does not need to change their password but role is not admin', () => {
//             it('should return status 401 - OK', async () => {


//                 const user = {
//                     _id: '3c676aa7-7c2d-4a48-b188-f324e4a5ceef'
//                 }

//                 const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 await supertest(app)
//                     .get(`/api/users`)
//                     .set('Cookie', [`token=${token}`])
//                     .expect(401)


//             })
//         })

//     })

//     describe('POST /api/users/register', () => {

//         describe('when the client provides valid information', () => {
//             it('should return status 201 - CREATED', async () => {

//                 const prefix = Math.round(Math.random() * 10000).toString();
//                 const postfix = Math.round(Math.random() * 10000).toString();

//                 const userToBeRegistered = {
//                     surname: 'tester',
//                     other_names: 'check',
//                     email: `check${prefix}@test${postfix}.com`,
//                     password: 'Password@1',
//                     confirmPassword: 'Password@1'
//                 }//password must be at least 8 characters long and at least have an upper case character and special character

//                 await supertest(app)
//                     .post(`/api/users/register`)
//                     .send(userToBeRegistered)
//                     .expect(201)
//             }),
//                 it('should return an application/json content-type header', async () => {

//                     const prefix = Math.round(Math.random() * 10000).toString();

//                     const userToBeRegistered = {
//                         surname: 'tester',
//                         other_names: 'check',
//                         email: `check${prefix}@test${prefix}.com`,
//                         password: 'Password@1',
//                         confirmPassword: 'Password@1'
//                     }//password must be at least 8 characters long and at least have an upper case character and special character

//                     const res = await supertest(app)
//                         .post(`/api/users/register`)
//                         .send(userToBeRegistered);

//                     expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));

//                 }),

//                 it('should return the registered user with _id and role but exclude the password', async () => {

//                     const prefix = Math.round(Math.random() * 10000).toString();
//                     const postfix = Math.round(Math.random() * 10000).toString();

//                     const userToBeRegistered = {
//                         surname: 'tester',
//                         other_names: 'check',
//                         email: `check${prefix}@test${postfix}.com`,
//                         password: 'Password@1',
//                         confirmPassword: 'Password@1'
//                     }//password must be at least 8 characters long and at least have an upper case character and special character

//                     const res = await supertest(app)
//                         .post(`/api/users/register`)
//                         .send(userToBeRegistered);
                    
//                     expect(res.body).toHaveProperty('type', 'success');
//                     expect(res.body).toHaveProperty('data');
//                     expect(res.body.data._id).toBeDefined();
//                     expect(res.body.data.role).toBeDefined();
//                     expect(res.body.data.password).toBeUndefined();

//                 })
//         })

//         describe('when the client provides emial that already exist', () => {
//             it('should return json with type property of error and status of 409 - CONFLICT', async () => {

//                 const userToBeRegistered = {
//                     surname: 'tester',
//                     other_names: 'check',
//                     email: `check3@test.com`,
//                     password: 'Password@1',
//                     confirmPassword: 'Password@1'
//                 }//password must be at least 8 characters long and at least have an upper case character and special character

//                 const res = await supertest(app)
//                     .post(`/api/users/register`)
//                     .send(userToBeRegistered);

//                 expect(res.statusCode).toEqual(409);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//             })


//         })

//         describe('when the client provides invalid information', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const userToBeRegistered = [{
//                     surname: 'tester',
//                     other_names: '',
//                     email: 'check@test.com',
//                     password: 'password@T',
//                     confirmPassword: 'passsword@T'
//                     //with empty field
//                 }, {
//                     surname: 'tester',
//                     other_names: 'check',
//                     email: 'check@test.com',
//                     password: 'password',
//                     confirmPassword: 'passsword'
//                     //with weak password
//                 }, {
//                     surname: 'tester',
//                     other_names: '',
//                     /* data without email field*/
//                     password: 'password',
//                     confirmPassword: 'passsword'
//                 }, {/*without any data */ },]

//                 //password must be at least 8 characters long and at least have an upper case character and special character

//                 for (const registrationData of userToBeRegistered) {
//                     await supertest(app)
//                         .post(`/api/users/register`)
//                         .send(registrationData)
//                         .expect(400)
//                 }

//             })
//         })


//     })

//     describe('POST /api/users/add/new', () => {

//         describe('when the client provides valid information and the user creating the new user has admin role', () => {
//             it('should return status 201 - CREATED', async () => {

//                 const prefix = Math.round(Math.random() * 10000).toString();

//                 const userToBeCreated = {
//                     surname: 'tester',
//                     other_names: 'check',
//                     email: `check${prefix}@test.com`,
//                     role: 'user' // or 'admin'
//                 }//password will be generated and sent to email address

//                 const admin = {
//                     _id: '1abd52de-d7b5-48e9-b03b-be56ab07eb2a'
//                 }

//                 const token = jwt.sign(admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .post(`/api/users/add/new`)
//                     .set('Cookie', [`token=${token}`])
//                     .send(userToBeCreated);
//                 expect(res.statusCode).toEqual(201);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'success');
//                 expect(res.body).toHaveProperty('data');
//                 expect(res.body.data._id).toBeDefined();
//                 expect(res.body.data.role).toBeDefined();
//                 expect(res.body.data.password).toBeUndefined();
//             })

//         })

//         describe('when the client provides emial that already exist and the user creating the new user has admin role', () => {
//             it('should return json with type property of error and status of 409 - CONFLICT', async () => {

//                 const userToBeCreated = {
//                     surname: 'tester',
//                     other_names: 'check',
//                     email: `check3@test.com`,
//                     role: 'admin'
//                 }

//                 const admin = {
//                     _id: '1abd52de-d7b5-48e9-b03b-be56ab07eb2a'
//                 }

//                 const token = jwt.sign(admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .post(`/api/users/add/new`)
//                     .set('Cookie', [`token=${token}`])
//                     .send(userToBeCreated);

//                 expect(res.statusCode).toEqual(409);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//             })


//         })

//         describe('when the client provides invalid information and the user creating the new user has admin role', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const userToBeRegistered = [
//                     {
//                         surname: 'tester',
//                         other_names: '',
//                         email: 'check@test.com',
//                         //with empty field
//                         role: 'user',
//                     },
//                     {
//                         surname: 'tester',
//                         other_names: 'check',
//                         email: 'check@test.com',
//                         //without role
//                     }
//                     , {
//                         surname: 'tester',
//                         other_names: '',
//                         /* data without email field*/
//                         role: 'admin'
//                     }, {/*without any data */ },]



//                 for (const registrationData of userToBeRegistered) {
//                     const admin = USERS.admin
//                     const token = jwt.sign(admin, SERVER_CONFIG.JWT_SECRET, {
//                         expiresIn: '7d',
//                     });

//                     await supertest(app)
//                         .post(`/api/users/add/new`)
//                         .set('Cookie', [`token=${token}`])
//                         .send(registrationData)
//                         .expect(400)
//                 }

//             })
//         })
//         describe('when the user creating the new user is not an admin', () => {
//             it('should return status 401 - BAD UNAUTHORIZED', async () => {

//                 const userToBeRegistered = [
//                     {
//                         surname: 'tester',
//                         other_names: 'check',
//                         email: 'check@test.com',
//                         role: 'user',
//                     }
//                 ] // even with correct data



//                 for (const registrationData of userToBeRegistered) {
//                     const user = USERS.user

//                     const token = jwt.sign(user, SERVER_CONFIG.JWT_SECRET, {
//                         expiresIn: '7d',
//                     });

//                     await supertest(app)
//                         .post(`/api/users/add/new`)
//                         .set('Cookie', [`token=${token}`])
//                         .send(registrationData)
//                         .expect(401)
//                 }

//             })
//         })


//     })

//     describe('PUT /api/users/password/reset', () => {

//         describe('when the client provide valid email address', () => {
//             it('should return status 200 - OK', async () => {

//                 const requestBody = { email: 'check5931@test5931.com' };

//                 const res = await supertest(app)
//                     .put(`/api/users/password/reset`)
//                     .send(requestBody);
//                 expect(res.statusCode).toEqual(200);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'success');
//                 expect(res.body).toHaveProperty('data');
//                 expect(res.body.data).toHaveProperty('must_change_password', true);

//             })

//         })

//         describe('when the client do not provide email or provide invalid email ', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const requestBodies = [
//                     { email: '' }, // invalid email - value empty 
//                     { email: 'check5o31@example.org' }, // email does not exist
//                     {  }, // invalid email - empty value
//                 ];

//                 for (const requestBody of requestBodies) {
//                     const res = await supertest(app)
//                         .put(`/api/users/password/reset`)
//                         .send(requestBody);
//                     expect(res.statusCode).toEqual(400);
//                     expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                     expect(res.body).toHaveProperty('type', 'error');
//                     expect(res.body).not.toHaveProperty('data');

//                 }



//             })

//         })

//     })
//     describe('PUT /api/users/password/change', () => {

//         describe('when the client is authenticated and provides valid data', () => {
//             it('should return status 200 - OK', async () => {

//                 const requestBody = {
//                     currentPassword: 'Password@1',
//                     newPassword: 'Password@1',
//                     confirmPassword: 'Password@1'
//                 };
//                  const authUser = USERS.user

//                 const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });


//                 const res = await supertest(app)
//                     .put(`/api/users/password/change`)
//                     .set('Cookie', [`token=${token}`])
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(200);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'success');
//                 expect(res.body).toHaveProperty('data');
//                 expect(res.body.data).toHaveProperty('must_change_password', false);

//             })

//         })


//         describe('when the client is not authenticated', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const requestBody = {
//                     currentPassword: 'Password@1',
//                     newPassword: 'Password@1',
//                     confirmPassword: 'Password@1'
//                 };
            
//                 const res = await supertest(app)
//                     .put(`/api/users/password/change`)
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(401);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data');
               

//             })

//         })


//         describe('when the client is authenticated but provide invalid', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const requestBodies = [{
//                     currentPassword: 'Password@1', //correct password
//                     newPassword: 'password1', // weak password
//                     confirmPassword: 'password1'
//                 }, {
//                     currentPassword: 'Password@1', //correct password
//                     newPassword: 'Password@2', // strong password
//                     confirmPassword: 'Password@3' // password not matching
//                 }, 
//                     {
//                     currentPassword: 'Password', // wrong password
//                     newPassword: 'Password@1', //strong password
//                      // missing field - confirm password
//                     },
//                     {
//                     currentPassword: 'Password', // wrong password
//                     newPassword: 'Password@1', //strong password
//                      confirmPassword: ''// undefined 
//                     },
//                     {}// empty request body
//                 ];
//                  const authUser = USERS.user

//                 const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });


//                 for (const requestBody of requestBodies) {

//                     const res = await supertest(app)
//                     .put(`/api/users/password/change`)
//                      .set('Cookie', [`token=${token}`])
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(400);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data');
                    
//                 }
            
                
               

//             })

//         })

//         describe('when the client is authenticated but provide wrong password - current password', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const requestBody = {
//                     currentPassword: 'Password', // wrong password
//                     newPassword: 'Password@1', //strong password
//                     confirmPassword: 'Password@1' // password matching
//                 }
                

//                  const authUser = USERS.user

//                 const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });


         

//                     const res = await supertest(app)
//                     .put(`/api/users/password/change`)
//                      .set('Cookie', [`token=${token}`])
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(401);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data');
                    
              
            
                
               

//             })

//         })

       

//     })
//     describe('PUT /api/users/information/update', () => {

//         describe('when the client is authenticated and provides valid data', () => {
//             it('should return status 200 - OK', async () => {

//                 const requestBody = {
//                     surname: 'Check',
//                     other_names: 'Tester',
//                     email: 'test@0000example.com'
//                 };
//                  const authUser = USERS.user

//                 const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });


//                 const res = await supertest(app)
//                     .put(`/api/users/information/update`)
//                     .set('Cookie', [`token=${token}`])
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(200);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'success');
//                 expect(res.body).toHaveProperty('data');
              

//             })

//         })


//         describe('when the client is not authenticated', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const requestBody = {
//                    surname: 'Check',
//                     other_names: 'Tester',
//                     email: 'test@0000example.com'
//                 };
            
//                 const res = await supertest(app)
//                     .put(`/api/users/information/update`)
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(401);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data');
               

//             })

//         })


//         describe('when the client is authenticated but provide invalid', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const requestBodies = [{
//                   surname: 'Check',
//                     other_names: 'Tester',
//                     email: ''
//                 }, {
//                    surname: 'Check',
//                     email: 'test@0000example.com'
//                 }, 
//                     {
//                     surname: 'Ch',
//                     other_names: 'Tester',
//                     email: 'test@0000example.com'
//                     },
//                     {}// empty request body
//                 ];
//                  const authUser = USERS.user

//                 const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });


//                 for (const requestBody of requestBodies) {

//                     const res = await supertest(app)
//                     .put(`/api/users/information/update`)
//                      .set('Cookie', [`token=${token}`])
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(400);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data');
                    
//                 }
            
                
               

//             })

//         })

//          describe('when the client is authenticated but chooses email already taken by another user', () => {
//             it('should return status 400 - BAD REQUEST', async () => {

//                 const requestBody ={
//                     surname: 'Check',
//                     other_names: 'New Tester',
//                     email: 'check3@test.com'
//                     }
//                  const authUser = USERS.user

//                 const token = jwt.sign(authUser, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                     const res = await supertest(app)
//                     .put(`/api/users/information/update`)
//                      .set('Cookie', [`token=${token}`])
//                     .send(requestBody)
                
//                 expect(res.statusCode).toEqual(400);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');
//                 expect(res.body).not.toHaveProperty('data');
 

//             })

//         })

//     })

//     describe('GET /api/users/logout', () => {

//         describe('when the client is logged in already', () => {
//             it('should return status 200 - OK', async () => {

//                 const admin = USERS.admin;

//                 const token = jwt.sign(admin, SERVER_CONFIG.JWT_SECRET, {
//                     expiresIn: '7d',
//                 });

//                 const res = await supertest(app)
//                     .get(`/api/users/logout`)
//                     .set('Cookie', [`token=${token}`])
//                 expect(res.statusCode).toEqual(200);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'success');
//                 expect(res.body).not.toHaveProperty('data');
//                 expect(res.headers['cookie']).not.toBeDefined();

//             })

//         })

//         describe('when the client is logged in ', () => {
//             it('should return status 401 - UNAUTHORIZED', async () => {

//                 const res = await supertest(app)
//                     .get(`/api/users/logout`)
//                 expect(res.statusCode).toEqual(401);
//                 expect(res.headers['content-type']).toEqual(expect.stringContaining('json'));
//                 expect(res.body).toHaveProperty('type', 'error');


//             })

//         })

//     })