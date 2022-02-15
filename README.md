# Wasabi Object Storage Module
A javascript based module to access and perform operations on Linode object storage via code. It has integrated linting, testing,
coverage, reporting, GitHub actions for publishing to npm repository, dependency updates and other goodies.

## Code Guardian
[![<app> build verification](https://github.com/aicore/wasabi-storage-lib/actions/workflows/build_verify.yml/badge.svg)](https://github.com/aicore/wasabi-storage-lib/actions/workflows/build_verify.yml)

<a href="https://sonarcloud.io/summary/new_code?id=wasabi-storage-lib">
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=alert_status" alt="Sonar code quality check" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=security_rating" alt="Security rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=vulnerabilities" alt="vulnerabilities" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=coverage" alt="Code Coverage" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=bugs" alt="Code Bugs" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=reliability_rating" alt="Reliability Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=sqale_rating" alt="Maintainability Rating" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=ncloc" alt="Lines of Code" />
  <img src="https://sonarcloud.io/api/project_badges/measure?project=aicore_wasabi-storage-lib&metric=sqale_index" alt="Technical debt" />
</a>


## Installing
* > npm i @aicore/wasabi-storage-lib

## Usage
### Prerequisite
1. To upload a file to a bucket in Wasabi Object Storage users need to configure accessKey, secretKey and create a bucket.
 Please refer to the official Wasabi guide to generate an accessKey and create a bucket.

   AccessKey Guide:  https://wasabi-support.zendesk.com/hc/en-us/articles/360019677192-Creating-a-Wasabi-API-Access-Key-Set

## Code usage

### Uploading File to Wasabi Bucket

Request Parameters :

* **accessKeyId (type: String):** bucket specific unique identifier required for authentication
* **secretAccessKey (type: String):** user specific unique identifier required for authentication
* **region (type: String):** indicates the geographical server location (e.g us-east-1, eu-west-1a)
* **file (type: String):** complete path of the file to be uploaded is passed on as a parameter
* **bucket (type: String):** uniquely identifies the bucket where the file should be uploaded

Please refer to https://docs.aws.amazon.com/sdk-for-javascript/index.html for more details.

```js
// import the module directly to your file
import wasabi from '@aicore/wasabi_storage_module.js';

//Example for uploading file to linode object storage
const response = await wasabi.uploadFileToBucket(accessKey, secretKey, region, fileName, bucketName);
```

### **2. getObject**

Request Parameters :

* **accessToken (type: String):** Linode API Key.
* **clusterId (type: String):**  indicates the geographical server location (e.g 'us-east-1', 'eu-west-1a')
* **bucketName (type: String):** Exact Name of the bucket the file resides in
* **objectName (type: String):** Exact Name(not the path) of the the file in String


```js
//Example for retrieving the File object URL
const fileURL = await linodeModule.fetchObjectUrl(accessToken, 
    clusterId, bucketName, objectName);
```

```
Request Body:

Object Fetch Response : {"AcceptRanges":"bytes","LastModified":"2022-02-14T12:58 :57.000Z","ContentLength":237,"ETag":"\"3df9179a0f577cb4dff46ff04201f19e\"","Con tentType":"text/plain","Metadata":{},"Body":{"type":"Buffer","data":[78,101,119, 32,102,105,101,108,100,115,32,116,111,32,98,101,32,97,100,100,101,100,13,10,49,4 6,100,111,119,110,108,111,97,100,85,114,108,32,61,32,115,116,114,105,110,103,13, 10,50,46,73,109,97,103,101,115,32,61,32,91,97,114,114,97,121,32,111,102,32,83,11 6,114,105,110,103,93,13,10,51,46,97,115,115,101,116,84,121,112,101,32,61,32,107, 101,121,119,111,114,100,32,40,84,104,101,109,101,47,69,120,116,101,110,115,105,1 11,110,41,32,13,10,13,10,49,46,32,84,104,101,109,101,115,32,99,108,97,115,115,10 5,102,105,99,97,116,105,111,110,44,32,104,111,119,63,13,10,50,46,32,69,120,116,1 01,110,115,105,111,110,32,99,108,97,115,115,105,102,105,99,97,116,105,111,110,44 ,32,104,111,119,63,13,10,51,46,32,78,80,77,32,112,117,98,108,105,115,104,44,32,1 04,111,119,63,13,10,52,46,32,69,120,116,101,110,115,105,111,110,32,105,99,111,11 0,115,44,32,119,104,101,114,101,63]}}

```

# Commands available

## Building
Since this is a pure JS template project, build command just runs test with coverage.
```shell
> npm install   // do this only once.
> npm run build
```

## Linting
To lint the files in the project, run the following command:
```shell
> npm run lint
```
To Automatically fix lint errors:
```shell
> npm run lint:fix
```

## Testing
To run all tests:
```shell
> npm run test
  Hello world Tests
    ✔ should return Hello World
    #indexOf()
      ✔ should return -1 when the value is not present
```

Additionally, to run unit/integration tests only, use the commands:
```shell
> npm run test:unit
> npm run test:integ
```

## Coverage Reports
To run all tests with coverage:

```shell
> npm run cover
  Hello world Tests
    ✔ should return Hello World
    #indexOf()
      ✔ should return -1 when the value is not present


  2 passing (6ms)

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
 index.js |     100 |      100 |     100 |     100 |                   
----------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 5/5 )
Branches     : 100% ( 2/2 )
Functions    : 100% ( 1/1 )
Lines        : 100% ( 5/5 )
================================================================================
Detailed unit test coverage report: file:///template-nodejs/coverage-unit/index.html
Detailed integration test coverage report: file:///template-nodejs/coverage-integration/index.html
```
After running coverage, detailed reports can be found in the coverage folder listed in the output of coverage command.
Open the file in browser to view detailed reports.

To run unit/integration tests only with coverage
```shell
> npm run cover:unit
> npm run cover:integ
```

Sample coverage report:
![image](https://user-images.githubusercontent.com/5336369/148687351-6d6c12a2-a232-433d-ab62-2cf5d39c96bd.png)

### Unit and Integration coverage configs
Unit and integration test coverage settings can be updated by configs `.nycrc.unit.json` and `.nycrc.integration.json`.

See https://github.com/istanbuljs/nyc for config options.

# Publishing packages to NPM
To publish a package to npm, push contents to `npm` branch in 
this repository. 

## Publishing `@aicore/package*`
If you are looking to publish to package owned by core.ai, you will need access to the GitHub Organization secret `NPM_TOKEN`.

For repos managed by [aicore](https://github.com/aicore) org in GitHub, Please contact your Admin to get access to core.ai's NPM tokens.


## Publishing to your own npm account
Alternatively, if you want to publish the package to your own npm account, please follow these docs:
1. Create an automation access token by following this [link](https://docs.npmjs.com/creating-and-viewing-access-tokens).
2. Add NPM_TOKEN to your repository secret by following this [link](https://docs.npmjs.com/using-private-packages-in-a-ci-cd-workflow)

To edit the publishing workflow, please see file: `.github/workflows/npm-publish.yml`


# Dependency updates
  We use Rennovate for dependency updates: https://blog.logrocket.com/renovate-dependency-updates-on-steroids/
  * By default, dep updates happen on sunday every week.
  * The status of dependency updates can be viewed here if you have this repo permissions in github: https://app.renovatebot.com/dashboard#github/aicore/template-nodejs
  * To edit rennovate options, edit the rennovate.json file in root, see https://docs.renovatebot.com/configuration-options/
  Refer 
  
# Code Guardian
Several automated workflows that check code integrity are integrated into this template.
These include:
1. GitHub actions that runs build/test/coverage flows when a contributor raises a pull request
2. [Sonar cloud](https://sonarcloud.io/) integration using `.sonarcloud.properties`
   1. In sonar cloud, enable Automatic analysis from `Administration
      Analysis Method` for the first time ![image](https://user-images.githubusercontent.com/5336369/148695840-65585d04-5e59-450b-8794-54ca3c62b9fe.png)

## IDE setup
SonarLint is currently available as a free plugin for jetbrains, eclipse, vscode and visual studio IDEs.
Use sonarLint plugin for webstorm or any of the available
IDEs from this link before raising a pull request: https://www.sonarlint.org/ .

SonarLint static code analysis checker is not yet available as a Brackets
extension.

## Internals
### Testing framework: Mocha , assertion style: chai
 See https://mochajs.org/#getting-started on how to write tests
 Use chai for BDD style assertions (expect, should etc..). See move here: https://www.chaijs.com/guide/styles/#expect

### Mocks and spies: sinon
 if you want to mock/spy on fn() for unit tests, use sinon. refer docs: https://sinonjs.org/

### Note on coverage suite used here:
we use c8 for coverage https://github.com/bcoe/c8. Its reporting is based on nyc, so detailed docs can be found
 here: https://github.com/istanbuljs/nyc ; We didn't use nyc as it do not yet have ES module support
 see: https://github.com/digitalbazaar/bedrock-test/issues/16 . c8 is drop replacement for nyc coverage reporting tool
