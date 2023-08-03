# File Server

## Description

A file server API where documents can be easily accessed and downloaded remotely as a solution to the scaling challenge of documents distribution.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Database Schemas](#Database-schemas)
- [API Endpoints](#api-endpoints)


## Installation

Clone the repository

```sh
$ git clone https://github.com/rBOUARO-AMALITECH/FILE-SERVER-API.git

```
Install the dependencies

```sh
$ npm install
```

Setup the environment variables

```sh
PORT = # default 5050
NODE_ENV = # default development

JWT_SECRET = 

# Nodemailer smtp.googlemail.com username and password
EMAIL_ADDRESS =
EMAIL_PASSWORD =

# Local Database Server Settings

DB_HOST =
DB_DATABASE =
DB_PORT = # default 5432
DB_USER = 
DB_PASSWORD =

OR

POSTGRES_URL = # Database connection string

AWS_BUCKET_NAME =
AWS_BUCKET_REGION =
AWS_ACCESS_KEY_ID =
AWS_SECRET_ACCESS_KEY = 

# Include origin to allowed origin
CLIENT_ORIGIN =

```

## Project Structure
```sh
.
├── package.json
├── README.md
├── src
|     ├── app.ts
|     ├── config.ts
|     ├── __tests__
│            ├── controllers
|                  ├── document.test.ts
|                  ├── user.test.ts
│                  └── LCF-31516-tut.pdf
│            ├── utils
│                  └── tokenGeneration.test.ts
│           └── app.test.ts
|     ├── Database
│           └── db.ts
|     ├── Endpoints
│           ├── Documents
│                 ├── controllers
|                       ├── destroyDocument.ts
|                       ├── documentsStat.ts
|                       ├── downloadDocument.ts
|                       ├── emailDocument.ts
|                       ├── getDocument.ts
|                       ├── getDocuments.ts
|                       ├── recents.ts
|                       ├── searchDocuments.ts
|                       ├── updateDocument.ts
│                       └── upload.ts
│                 ├── Models.ts
│                 └── root.ts
│           ├── Users
│                 ├── controllers
|                       ├── auth.ts
|                       ├── changePassword.ts
|                       ├── createUser.ts
|                       ├── getUser.ts
|                       ├── getUsers.ts
|                       ├── logout.ts
|                       ├── register.ts
|                       ├── resetPassword.ts
│                       └── updateUser.ts
│                 ├── Models.ts
│                 └── root.ts
│           ├── Middlewares
|                 ├── errors.ts
│                 ├── accessRestriction.ts
│                 └── authenticate.ts
│           ├── utils
|                 ├── email.ts
│                 ├── fileUploader.ts
│                 ├── mailTemplate.ts
│                 ├── s3.ts
│                 ├── server.ts
│                 ├── swagger.ts
│                 └── tokenGenerator.ts
│           └── default.ts
└── public
    └── .gitkeep
```
## Database Schemas

![ER Diagram](https://github.com/rBOUARO-AMALITECH/FILE-SERVER-API/blob/087909ff3496d1bd90b23176291e78d71285cb86/ER-Diagram.png)


## API Endpoints

Implemented endpoints 

### Registration endpoint
 (Self registration)

- **Description**: Creates a new user with role=user 
- **Method**: POST
- **URL**: api/users/register
- **Request**:
   Request body
    
    ```json
    {
    "surname": string,
    "other_names": string,
    "email": string,
    "password": string,
    "confirmPassword": string
    }

     ```      
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "surname": string,
    "other_names": string,
    "email": string,
    "role": string,
    "must_change_password": false,
    "created_at": string,
    "updated_at": string
    }

    }

     ```
   Error responses (status code 400 | 409 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Auth endpoint
 (Login)

- **Description**: Authenticate 
- **Method**: POST
- **URL**: api/users/auth
- **Request**:
  Request body
    
    ```json
    {
   
    "email": string,
    "password": string,

    }

     ```      
- **Response**:
  Success response (status code 200). HttpOnly cookie will be set to the response header and also return user.
   ```json
    {

  "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "surname": string,
    "other_names": string,
    "email": string,
    "role": string,
    "must_change_password": false,
    "created_at": string,
    "updated_at": string
    }

    }

     ```
  Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Logout endpoint
 (Logout user)

- **Description**: Logout user 
- **Method**: GET
- **URL**: api/users/logout      
- **Response**:
  Success response (status code 200). HttpOnly cookie will be destroyed.
   ```json
    {

  "code": string,
  "message": string,
  "type": "success",

    }

     ```
  Error responses (status code 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Create User endpoint
 (Admin user operation - adding new users)

- **Description**: Creates a new user with role = user | admin 
- **Method**: POST
- **URL**: api/users/add/new
- **Request**:
   Request body
    
    ```json
    {
    "surname": string,
    "other_names": string,
    "email": string,
    "role": "user" | "admin",
    }

     ```      
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "surname": string,
    "other_names": string,
    "email": string,
    "role": string,
    "must_change_password": true,
    "created_at": string,
    "updated_at": string
    }

    }

     ```
   Error responses (status code 400 | 409 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Get all Users endpoint
 (All users - admin only operation)

- **Description**: Retrieves all users - ristricted to admin users only 
- **Method**: GET
- **URL**: api/users/    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": [{
    "_id": string,
    "surname": string,
    "other_names": string,
    "email": string,
    "role": string,
    "must_change_password": boolean,
    "created_at": string,
    "updated_at": string
    }, ...]

    }

     ```
   Error responses (status code 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Get a User endpoint
 (Retrieve a user)

- **Description**: Retrieves a specific user 
- **Method**: GET
- **URL**: api/users/:_id    
- **Parameter**: _id (in url path)    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "surname": string,
    "other_names": string,
    "email": string,
    "role": string,
    "must_change_password": boolean,
    "created_at": string,
    "updated_at": string
    }

    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Change password endpoint
 (change user password)

- **Description**: Allows a user to change their password 
- **Method**: PUT
- **URL**: api/users/password/change
- **Request**:
   Request body
    
    ```json
    {

    "currentPassword": string,
    "newPassword": string,
    "confirmPassword": string

    }

     ```      
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  
    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Update user information endpoint
 (update user)

- **Description**: Update user information 
- **Method**: PUT
- **URL**: api/users/information/update
- **Request**:
   Request body
    
    ```json
    {

    "surname": string,
    "other_names": string,
    "email": string

    }

     ```      
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "surname": string,
    "other_names": string,
    "email": string,
    "role": string,
    "must_change_password": boolean,
    "created_at": string,
    "updated_at": string
    }
    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Reset password endpoint
 (reset password)

- **Description**: Reset user's password to recover lost password
- **Method**: PUT
- **URL**: api/users/password/reset
- **Request**:
   Request body
    
    ```json
    {

    "email": string

    }

     ```      
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success"

    }

     ```
   Error responses (status code 400 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```

### New document endpoint
 (upload document)

- **Description**: Add a new document 
- **Method**: POST
- **URL**: api/documents/upload
- **Request**:
   Request body
    
    ```json
    {
    "title": string,
    "description": string,
    "document ": file,
    }

     ```      
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }

    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```

### Get all documents endpoint
 (All documents)

- **Description**: Retrieves all documents
- **Method**: GET
- **URL**: api/documents/    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": [{
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }, ...]

    }

     ```
   Error responses (status code 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Get a document endpoint
 (Retrieve a document)

- **Description**: Retrieves a specific document 
- **Method**: GET
- **URL**: api/documents/:_id    
- **Parameter**: _id (in url path)    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }

    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Delete a document endpoint
 (delete a document)

- **Description**: Delete a specific document 
- **Method**: DELETE
- **URL**: api/documents/destroy/:_id    
- **Parameter**: _id (in url path)    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }

    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Update document endpoint
 (update a document)

- **Description**: Update document information
- **Method**: PUT
- **URL**: api/documents/update/:_id    
- **Parameter**: _id (in url path)
- **Request**:
   Request body
    
    ```json
    {
      
    "title": string,
    "description": string

    }
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }

    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Search document endpoint
 (search documents)

- **Description**: Search for documents
- **Method**: POST
- **URL**: api/documents/search   
- **Request**:
   Request body
    
    ```json
    {

    "search": string,

    }
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": [{
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }, ...]

    }

     ```
   Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```

### Download document endpoint
 (download a document)

- **Description**: Download a specific document
- **Method**: GET
- **URL**: api/documents/download/:_id    
- **Parameter**: _id (in url path)
- **Response**:
  Success response (status code 200) with file attached to the response.

  Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Email document endpoint
 (request a document )

- **Description**: Request a document to be sent to authenticated users email address
- **Method**: GET
- **URL**: api/documents/email/:_id    
- **Parameter**: _id (in url path)
- **Response**:
  Success response (status code 200) and file attached to mail sent to the user.
  ```json
    {

    "code": string,
    "message": string,
    "type": "success",

    }

    ```

  Error responses (status code 400 | 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```

### Get all recent documents endpoint
 (Recent documents)

- **Description**: Retrieves all recent documents either downloaded or requested to be sent to the user via email
- **Method**: GET
- **URL**: api/documents/recent/documents    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": [{
    "_id": string,
    "title": string,
    "description": string,
    "name": string,
    "downloaded_count": integer,
    "emailed_count": integer,
    "size": integer,
    "ext": string,
    "created_at": string,
    "updated_at": string
  }, ...]

    }

     ```
   Error responses (status code 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
### Get stats on documents endpoint
 (Available documents stats)

- **Description**: Get stats on available documents
- **Method**: GET
- **URL**: api/documents/stats    
- **Response**:
  Success response (status code 200).
   ```json
    {

    "code": string,
  "message": string,
  "type": "success",
  "data": {
    "folders": [
      {
        "ext": "string",
        "count": 0,
        "total_count": 0
      }
    ],
    "performing": [
      {
        "_id": string,
        "title": string,
        "description": string,
        "name": string,
        "downloaded_count": integer,
        "emailed_count": integer,
        "size": integer,
        "ext": string,
        "created_at": string,
        "updated_at": string,
        "downloaded_emailed": integer
      }
    ],
    "avg_file_size": integer
  }

    }

     ```
   Error responses (status code 401 | 500).
    ```json
    {

    "code": string,
    "message": string,
    "type": "error"

    }

    ```
