// const AWS = require("aws-sdk");
const AWS3 = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const configParams = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	retryDelayOptions: { base: 50 },
	maxRetries: 1,
};

const BUCKET = process.env.AWS_S3_BUCKET_NAME;
/**
 * AWS S3 instance for aws-sdk v2
 */
// const S3 = new AWS.S3();

/**
 * AWS configuration @aws-sdk v3
 */
// AWS.config.update(configParams);

const s3Client = new AWS3.S3Client({
	credentials: {
		accessKeyId: configParams.accessKeyId,
		secretAccessKey: configParams.secretAccessKey,
		region: configParams.region,
	},
});

/**
 * Generate signed URL from AWS
 * @param {*} filePath File path of accessing file
 */
// USING AWS-SDK V2
// exports.getSignedImageURL = (filePath, bucket = null, time = null) => {
// 	const params = {
// 		Bucket: bucket ? bucket : BUCKET,
// 		Key: filePath,
// 		Expires: time || 5000,
// 	};
// 	return S3.getSignedUrl("getObject", params);
// };

//USING AWS-SDK V3

exports.getSignedImageURL = async (filePath, bucket = null, time = null) => {
	const params = {
		Bucket: bucket ? bucket : BUCKET,
		Key: filePath,
		Expires: time || 5000,
	};

	const command = new AWS3.GetObjectCommand(params);
	const signedUrl = await getSignedUrl(s3Client, command, {
		expiresIn: params.Expires,
	});

	return signedUrl;
};

// /**
//  * Upload file on AWS using  aws-sdk@v2
//  * @param {string} filePath Address of file
//  * @param {buffer} image image data
//  * @param {string} bucket Name of bucket in which you want to upload
//  * @param {string} acl Type of access control like `private`, `public-read`, `public-read-write`
//  * @param {string} contentType File content type like `application/pdf`, `image/jpg`, `image/png`
//  */
// exports.uploadFile = (
// 	filePath,
// 	image,
// 	bucket = null,
// 	acl = null,
// 	contentType = null
// ) => {
// 	const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: filePath };
// 	if (contentType) params.ContentType = contentType;
// 	if (bucket) params.Bucket = bucket;
// 	if (acl) params.ACL = acl;
// 	params.Body = image instanceof Buffer ? image : image.buffer;
// 	return S3.upload(params).promise();
// };

/**
 * Upload file on AWS @aws-sdk-v3
 * @param {string} filePath Address of file
 * @param {Buffer} image Image data
 * @param {string} bucket Name of the bucket in which you want to upload
 * @param {string} acl Type of access control like `private`, `public-read`, `public-read-write`
 * @param {string} contentType File content type like `application/pdf`, `image/jpg`, `image/png`
 * @returns {Promise} A Promise that resolves with the S3 response
 */
exports.uploadFile = async (filePath, image, contentType = null) => {
	const params = {
		Bucket: BUCKET,
		Key: filePath,
		Body: image, // No need for fromBuffer conversion
	};
	// console.log(`upload params --> ${JSON.stringify(params)} `);

	if (contentType) params.ContentType = contentType;
	// if (acl) params.ACL = acl;

	const command = new AWS3.PutObjectCommand(params);

	try {
		const response = await s3Client.send(command);
		return response;
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw error;
	}
};

/**
 * Get S3 file object buffer
 * @param {string} filePath  Address of file
 * @param {string} bucket Name of bucket in which you want to upload
 */
// aws-sdk v2
// exports.getObject = async (filePath, bucket = null) => {
// 	const bucketParam = bucket || BUCKET;
// 	const params = { Bucket: bucketParam, Key: filePath };
// 	const fileObject = await S3.getObject(params).promise();
// 	return fileObject.Body;
// };

// aws-sdk v3
exports.getObject = async (filePath, bucket = null) => {
	const bucketParam = bucket || BUCKET;
	const command = new AWS3.GetObjectCommand({
		Bucket: bucketParam,
		Key: filePath,
	});

	try {
		const response = await s3Client.send(command);
		return response.Body;
	} catch (err) {
		console.error(err);
	}
};

/**
 * Check given path is exist or not in aws
 * @param {*} filePath Address of file
 */

// //using aws-sdk v2
// exports.listObject = async (filePath, bucket = null) => {
// 	const params = {
// 		Bucket: bucket || process.env.AWS_S3_BUCKET_NAME,
// 		Prefix: filePath,
// 	};
// 	const data = await S3.listObjectsV2(params).promise();
// 	return data;
// };

//using aws-sdk v3

exports.listObject = async (filePath, bucket = null) => {
	const bucketParam = bucket || BUCKET;
	const params = {
		Bucket: bucketParam,
		Prefix: filePath,
	};
	const data = await s3Client.send(new AWS3.ListObjectsV2Command(params));
	return data;
};

/**
 * Upload base64 file on AWS
 * @param {*} filePath Address of file
 * @param {*} image image data
 */

// using aws-sdk v2
exports.uploadBase64File = (filePath, image, bucket = null) => {
	const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: filePath };
	if (bucket) params.Bucket = bucket;
	params.Body = image instanceof Buffer ? image : image;
	return S3.putObject(params).promise();
};

// using aws-sdk v3

exports.uploadBase64File = async (filePath, image, bucket = null) => {
	const params = {
		Bucket: BUCKET,
		Key: filePath,
		Body: image, // No need for fromBuffer conversion
	};
	if (bucket) params.Bucket = bucket;
	const command = new AWS3.PutObjectCommand(params);
	try {
		const response = await s3Client.send(command);
		return response;
	} catch (error) {
		console.error("Error uploading file to S3:", error);
		throw error;
	}
};

/**
 * Remove file from AWS
 * @param {string} filePath Address of file which you want to delete
 * @param {string} bucket Name of bucket from which you want to remove specific file
 */

// using aws-sdk v2
// exports.removeFile = (filePath, bucket = null) => {
// 	const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: filePath };
// 	if (bucket) params.Bucket = bucket;
// 	return S3.deleteObject(params).promise();
// };

// using aws-sdk v3
exports.removeFile = async (filePath, bucket = null) => {
	const params = { Bucket: BUCKET, Key: filePath };
	if (bucket) params.Bucket = bucket;
	try {
		const response = await s3Client.send(new AWS3.DeleteObjectCommand(params));
		return response;
	} catch (err) {
		console.error(err);
	}
};
