
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
 We received a request to reset your password for your account at Lizzy Cloud Docs. To proceed with the password reset, click the link below:<br/>
<br/>
[password: ${info}]
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