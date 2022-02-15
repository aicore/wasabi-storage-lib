
/*
 * GNU AGPL-3.0 License
 *
 * Copyright (c) 2021 - present core.ai . All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see https://opensource.org/licenses/AGPL-3.0.
 *
 */
import pkg from 'aws-sdk';
import joinURL from 'url-join';
import path from 'path';
import fsExtra from "fs-extra";
import stream from "stream";

const {S3, Endpoint} = pkg;

/**
 * Module to upload a file to AWS S3/Linode Object Storage. The path of the file to be uploaded is
 * passed on as a parameter which is then processed and uploaded using AWS S3 client.
 *
 * @param accessKeyId bucket specific unique identifier required for authentication
 * @param secretAccessKey user specific unique identifier required for authentication
 * @param region indicates the geographical server location (e.g us-east-1, eu-west-1a)
 * @param file complete path of the file to be uploaded is passed on as a parameter
 * @param bucket uniquely identifies the bucket where the file should be uploaded
 * @param url suffix url to decide whether to upload the file to AWS S3 or LiNode Object Storage
 * @returns {Promise<void>} void
 */

async function uploadFileToBucket (accessKeyId, secretAccessKey, region, file, bucket, url) {
    const uploadStream = ({ Bucket, Key }) => {
        const s3Client = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            endpoint: new Endpoint('https://s3.'+ region + url)
        });
        const pass = new stream.PassThrough();
        return {
            writeStream: pass,
            promise: s3Client.upload({ Bucket, Key, Body: pass }).promise()
        };
    };
    const filePath = path.basename(file);
    const { writeStream, promise } = uploadStream({Bucket: bucket, Key: filePath});
    fsExtra.createReadStream(filePath).pipe(writeStream);
    const response = {
        status: true,
        errorMessage: ''
    };
    await promise.catch((reason)=> {
        response.status = false;
        response.errorMessage = reason.toString();
    });
    return response;
}

/**
 * Module to get the object data. The path of the file to be retrieved is
 * passed on as a parameter and the obejct stream is fetched using AWS S3 client.
 * 
 * @param accessKeyId bucket specific unique identifier required for authentication
 * @param secretAccessKey user specific unique identifier required for authentication
 * @param region indicates the geographical server location (e.g us-east-1, eu-west-1a)
 * @param bucketName uniquely identifies the bucket where the file should be uploaded
 * @param objectName object to be retrieved is passed on as a parameter
 * @param url suffix url to decide whether to upload the file to AWS S3 or LiNode Object Storage
 * @returns getObjectResponse 
 */
async function getObject(accessKeyId, secretAccessKey, region, bucketName, objectName, url) {
    try {
        const s3Client = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            endpoint: new Endpoint('https://s3.'+ region + url
            )
        });
        
        let params = {
            Bucket: bucketName,
            Key: objectName
        };
        
       return await s3Client.getObject(params).promise();
    } catch (e) {
        throw new Error(`Could not retrieve file from bucket: ${e.message}`);
    }
}

export default {
    uploadFileToBucket,
    getObject
};
