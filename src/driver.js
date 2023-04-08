/** 
import wasabi from './wasabi_storage_module.js';
const fileName = '';
const accessKey = '';
const secretKey = '';
const region = '';
const bucketName = '';
async function run() {
    //const response = await wasabi.uploadFileToBucket(accessKey, secretKey, region, fileName, bucketName);
    // const fileUrl = await wasabi.fetchObject(accessKey, secretKey, region, bucketName, fileName);
    // await wasabi.downloadFileFromBucket(accessKey, secretKey, region, bucketName, fileName, "a.tar.gz");
    console.log(await wasabi.listObjects(accessKey, secretKey, region, bucketName, "testApp/"));
    console.log("done");
}
run().catch(console.log);
*/