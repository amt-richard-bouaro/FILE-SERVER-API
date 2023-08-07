const initiateDatabase = `

CREATE TABLE IF NOT EXISTS users(
 	_id VARCHAR(50) PRIMARY KEY,
 	surname VARCHAR(100) NOT NULL,
 	other_names VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	 role VARCHAR(20) NOT NULL,
	 must_change_password boolean DEFAULT FALSE,
	 created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );
 
 
 CREATE TABLE IF NOT EXISTS documents(
 	_id VARCHAR(50) PRIMARY KEY,
 	title VARCHAR(100) NOT NULL,
 	description VARCHAR(500) NOT NULL,
	name VARCHAR(150) NOT NULL UNIQUE,
	size INTEGER DEFAULT 0,
	downloaded_count INTEGER DEFAULT 0,
	emailed_count INTEGER DEFAULT 0,
	user_id VARCHAR(50) NOT NULL REFERENCES users(_id),
	location VARCHAR(100) NOT NULL,
	ext VARCHAR(30) NOT NULL,
	mime_type VARCHAR(200) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );


 CREATE TABLE IF NOT EXISTS user_docs(
 	_id SERIAL PRIMARY KEY,
	user_id VARCHAR(50) NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
	doc_id VARCHAR(50) NOT NULL REFERENCES documents(_id) ON DELETE CASCADE,
	via VARCHAR(50) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 );


 INSERT INTO users(
    _id,
 	surname,
 	other_names,
	email,
	password ,
	 role , 
	 created_at,
     updated_at,must_change_password ) 
     
     VALUES
     (
        'e3eed61f-a296-4273-ba0e-89dcdac2002d',
        'Ghet',
        'Rich',
        'ghetrich370555@gmail.com',
        '$2b$10$qUsqH6THo67tg3/q4zxLaOm1R.MTxCrDQ7Nmpxc0J/ipMTeSKYP7.',
        'admin',
		'2023-07-19 04:58:54.146768+00',
        '2023-07-27 11:49:21.363041+00',
        false
        ), 

 (
    '3c676aa7-7c2d-4a48-b188-f324e4a5ceef',
    'new',
    'meew',
    'rich2@example.com',
    '$2b$10$/OSGxsgu6pAC0ZOYu0pWnu9sNgS289MqIyHi62eHFu08H4ZbJyOIK',
    'user',
    '2023-07-25 09:30:38.654791+00',
    '2023-07-25 15:53:31.539617+00',
    false
    ), 

 	(
    '3c676aa7-7c2d-4a48-4273-f324e4a5ceef',
    'Fake',
    'User 3',
    'fake@example.com',
    '$2b$10$/OSGxsgu6pAC0ZOYu0pWnu9sNgS289MqIyHi62eHFu08H4ZbJyOIK',
    'user',
    '2023-07-25 09:30:38.654791+00',
    '2023-07-25 15:53:31.539617+00',
    true
    );

INSERT INTO documents (_id, name, title, description, user_id, location, size, mime_type, ext) VALUES ('6e9caa0c-b032-4501-971f-edf212be0209','LCF-86488-Cisco VPN (5).pdf', 'Test Document', 'Test Description','3c676aa7-7c2d-4a48-b188-f324e4a5ceef','LCF-86488-Cisco VPN (5).pdf',835500,'application/pdf', 'pdf');
 
 `;

const dropTables = `
DROP TABLE IF EXISTS user_docs;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS users;

`

const USERS: {
    user: {
        _id: string;
    },
    userMustChangePassword: {
        _id: string;
    }
    , admin: {
        _id: string;
    }
} = {
    user: { _id: '3c676aa7-7c2d-4a48-b188-f324e4a5ceef' },
    userMustChangePassword: { _id: '3c676aa7-7c2d-4a48-4273-f324e4a5ceef' },
    admin: { _id: 'e3eed61f-a296-4273-ba0e-89dcdac2002d' },
}

export {initiateDatabase, dropTables, USERS};