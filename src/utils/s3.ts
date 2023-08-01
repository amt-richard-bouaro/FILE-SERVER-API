
import { S3_BUCKET } from '../config'
import { S3Client, GetObjectCommand,DeleteObjectCommand } from '@aws-sdk/client-s3';
import type {Readable} from 'stream'

const s3 = new S3Client({
    region: S3_BUCKET.REGION,
    credentials: {
        accessKeyId: S3_BUCKET.ACCESS_KEY,
        secretAccessKey: S3_BUCKET.SECRET_KEY
    }
});


export const getFile = async (fileKey: string) =>{

    const downloadParameters = {
        Key: fileKey,
        Bucket: S3_BUCKET.NAME
    }

    try {
      
    const getObjectCommand = new GetObjectCommand(downloadParameters)

        const response = await s3.send(getObjectCommand);

        if (response) {
        const stream = response.Body as Readable

    return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.once('end', () => resolve(Buffer.concat(chunks)))
    stream.once('error', reject)
})
        } 


        return undefined

    
        
  } catch (error) {
    console.error('Error getting object:', error);
  }

   
}


export const deleteObject = async (fileKey: string) => {
   const deleteParameters = {
        Key: fileKey,
        Bucket: S3_BUCKET.NAME
    }

    try {
        const deleteObjectCommand = new DeleteObjectCommand(deleteParameters)
        const response = await s3.send(deleteObjectCommand);
            
        return response['$metadata'].httpStatusCode
        
  } catch (err) {
    console.error(err);
    return false;
  }
};