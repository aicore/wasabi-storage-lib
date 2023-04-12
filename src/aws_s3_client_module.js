
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
import path from 'path';
import fsExtra from "fs-extra";
import stream from "stream";
import * as fs from "fs";

const {S3, Endpoint} = pkg;

/**
 * Module to upload a file to AWS S3/Linode Object Storage. The path of the file to be uploaded is
 * passed on as a parameter which is then processed and uploaded using AWS S3 client.
 *
 * @param accessKeyId bucket specific unique identifier required for authentication
 * @param secretAccessKey user specific unique identifier required for authentication
 * @param region indicates the geographical server location (e.g us-east-1, eu-west-1a)
 * @param filePath complete path of the file to be uploaded is passed on as a parameter
 * @param bucket uniquely identifies the bucket where the file should be uploaded
 * @param url suffix url to decide whether to upload the file to AWS S3 or LiNode Object Storage
 * @param objectNameOverride If provided, the file will be uploaded with the given object name. Use this to provide
 * custom file names and paths in s3.
 * @returns {Promise<void>} void
 */

async function uploadFileToBucket (accessKeyId, secretAccessKey, region, filePath, bucket, url, objectNameOverride) {
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
    const objectName = objectNameOverride ? objectNameOverride : path.basename(filePath);
    const { writeStream, promise } = uploadStream({Bucket: bucket, Key: objectName});
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

/**
 * deletes the given  object.
 *
 * @param accessKeyId bucket specific unique identifier required for authentication
 * @param secretAccessKey user specific unique identifier required for authentication
 * @param region indicates the geographical server location (e.g us-east-1, eu-west-1a)
 * @param bucketName uniquely identifies the bucket where the file should be uploaded
 * @param objectName object to be retrieved is passed on as a parameter
 * @param url suffix url to decide whether to upload the file to AWS S3 or LiNode Object Storage
 * @returns getObjectResponse
 */
async function deleteObject(accessKeyId, secretAccessKey, region, bucketName, objectName, url) {
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

        return await s3Client.deleteObject(params).promise();
    } catch (e) {
        throw new Error(`Could not retrieve file from bucket: ${e.message}`);
    }
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
function downloadObject(accessKeyId, secretAccessKey, region, bucketName, objectName, url, destFilePath) {
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

        let s3ReadStream = s3Client.getObject(params).createReadStream();
        let fileStream = fs.createWriteStream(destFilePath);
        return new Promise((resolve, reject)=>{
            s3ReadStream.on('finish', resolve);
            s3ReadStream.on('error', reject);
            s3ReadStream.pipe(fileStream);
        });
    } catch (e) {
        throw new Error(`Could not download file from bucket: ${e.message}`);
    }
}

/**
 * lists all objects in a bucket based on prefix. Eg, to return all files in dir `a/b/`, pass in prefix as `a/b/`
 * a maximum of 1000 objects is usually returned(limited by AWS).
 * @param accessKeyId bucket specific unique identifier required for authentication
 * @param secretAccessKey user specific unique identifier required for authentication
 * @param region indicates the geographical server location (e.g us-east-1, eu-west-1a)
 * @param bucketName uniquely identifies the bucket where the file should be uploaded
 * @param prefix an optional string to narrow down to specific objects. Eg, to return all files in dir `a/b/`,
 * pass in prefix as `a/b/`
 * @param url suffix url to decide whether to upload the file to AWS S3 or LiNode Object Storage
 * @returns listObjectResponse
 */
function listObjects(accessKeyId, secretAccessKey, region, bucketName, prefix, url) {
    try {
        const s3Client = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            endpoint: new Endpoint('https://s3.'+ region + url
            )
        });

        let params = {
            Bucket: bucketName,
            Prefix: prefix
        };

        return s3Client.listObjects(params).promise();
    } catch (e) {
        throw new Error(`Could not listObjects bucket: ${e.message}`);
    }
}


export default {
    uploadFileToBucket,
    getObject,
    downloadObject,
    listObjects,
    deleteObject
};
