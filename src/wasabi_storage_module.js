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
import s3Client from './aws_s3_client_module.js';

const BASE_LINODE_URL_SUFFIX = '.wasabisys.com';

/**
 * Wasabi Storage Helper Module to upload a file to object storage. The file is uploaded using
 * AWS S3 Client. Please refer to https://docs.aws.amazon.com/sdk-for-javascript/index.html for more details.
 *
 * @param accessKeyId bucket specific unique identifier required for authentication
 * @param secretAccessKey user specific unique identifier required for authentication
 * @param region indicates the geographical server location (e.g us-east-1, eu-west-1a)
 * @param file complete path of the file to be uploaded is passed on as a parameter
 * @param bucket uniquely identifies the bucket where the file should be uploaded
 * @param objectNameOverride If provided, the file will be uploaded with the given object name. Use this to provide
 * custom file names and paths in wasabi.
 * @returns {Promise<void>}
 */
 async function uploadFileToBucket(accessKeyId, secretAccessKey, region, file, bucket, objectNameOverride) {
    if (!accessKeyId || !secretAccessKey || !region || !file || !bucket) {
        throw new Error("Invalid parameter value: accessKeyId, secretAccessKey, region, filePath " +
        "and bucketName are required parameters");
    }

    const response = await s3Client.uploadFileToBucket(accessKeyId,
        secretAccessKey, region, file, bucket, BASE_LINODE_URL_SUFFIX, objectNameOverride);
    console.log("Object Upload Response : " + JSON.stringify(response));
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
 * @returns getObjectResponse
 */
async function fetchObject(accessKeyId, secretAccessKey, region, bucketName, objectName) {
    if (!region || !bucketName || !objectName) {
        throw new Error("Invalid parameter value: accessToken, region, fileName " +
        "and bucketName are required parameters");
    }
    const response = await s3Client.getObject(accessKeyId, secretAccessKey, region,
        bucketName, objectName, BASE_LINODE_URL_SUFFIX);

    if (!response || !response.Body || !response.Body.data) {
        throw new Error("Invalid Response: Body or Body.Data is missing");
    }

    console.log("Object Fetch Response : " + JSON.stringify(response));
    return response.Body.data;
}

export default {
    uploadFileToBucket,
    fetchObject
};
