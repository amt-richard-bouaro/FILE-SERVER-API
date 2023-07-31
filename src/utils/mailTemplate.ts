

export const passwordChanged = (info:string) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>

 <p>
    Hello,
 </p>

 <p>
 We received a request to reset your password for your account at Lizzy Cloud Docs.<br/>
<br/>
[ password: <h3>${info}</h3> ]
<br/>
<br/>
If you didn't request this password reset, please ignore this email. Your account remains secure, and no action is needed.
<br/><br/>
For security reasons, this link is valid for the next 30 minutes. After that, you'll need to request another reset.
<br/><br/>
If you have any questions or need further assistance, please don't hesitate to contact our support team at ghetrich370@gmail.com.
<br/><br/>
Best regards,<br/><br/>
Lizzy Cloud Docs Team.
 </p> 
    
</body>
</html>
    
    `
}
export const emailDocument = (name:string) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>

 <p>
    Hello ${name},
 </p>

 <p>
 We received a request from your account at Lizzy Cloud Docs request a document. Please find attached the requested document<br/>
<br/>

<br/>
<br/>
If you didn't request this document, please ignore this email.
<br/><br/>

If you have any questions or need further assistance, please don't hesitate to contact our support team at ghetrich370@gmail.com.
<br/><br/>
Best regards,<br/><br/>
Lizzy Cloud Docs Team.
 </p> 
    
</body>
</html>
    
    `
}