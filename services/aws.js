const AWS = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const configParams = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
	retryDelayOptions: { base: 50 },
	maxRetries: 1,
};

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

/**
 * AWS configuration
 */
AWS.config.update(configParams);

/**
 * AWS S3 instance
 */
const S3 = new AWS.S3();

/**
 * Generate signed URL from AWS
 * @param {*} filePath File path of accessing file
 */
exports.getSignedImageURL = (filePath, bucket = null, time = null) => {
	const params = {
		Bucket: bucket || process.env.AWS_S3_BUCKET_NAME,
		Key: filePath,
		Expires: time || 5000,
	};
	return S3.getSignedUrl("getObject", params);
};

// /**
//  * Upload file on AWS
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
 * Upload file on AWS
 * @param {string} filePath Address of file
 * @param {Buffer} image Image data
 * @param {string} bucket Name of the bucket in which you want to upload
 * @param {string} acl Type of access control like `private`, `public-read`, `public-read-write`
 * @param {string} contentType File content type like `application/pdf`, `image/jpg`, `image/png`
 * @returns {Promise} A Promise that resolves with the S3 response
 */
exports.uploadFile = async (
	filePath,
	image,
	bucket = process.env.AWS_S3_BUCKET_NAME,
	acl = null,
	contentType = null
) => {
	const params = {
		Bucket: bucket,
		Key: filePath,
		Body: image, // No need for fromBuffer conversion
	};

	if (contentType) params.ContentType = contentType;
	if (acl) params.ACL = acl;

	const command = new PutObjectCommand(params);

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
exports.getObject = async (filePath, bucket = null) => {
	const bucketParam = bucket || process.env.AWS_S3_BUCKET_NAME;
	const params = { Bucket: bucketParam, Key: filePath };
	const fileObject = await S3.getObject(params).promise();
	return fileObject.Body;
};

/**
 * Check given path is exist or not in aws
 * @param {*} filePath Address of file
 */
exports.listObject = async (filePath, bucket = null) => {
	const params = {
		Bucket: bucket || process.env.AWS_S3_BUCKET_NAME,
		Prefix: filePath,
	};
	const data = await S3.listObjectsV2(params).promise();
	return data;
};

/**
 * Upload base64 file on AWS
 * @param {*} filePath Address of file
 * @param {*} image image data
 */
exports.uploadBase64File = (filePath, image, bucket = null) => {
	const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: filePath };
	if (bucket) params.Bucket = bucket;
	params.Body = image instanceof Buffer ? image : image;
	return S3.putObject(params).promise();
};

/**
 * Remove file from AWS
 * @param {string} filePath Address of file which you want to delete
 * @param {string} bucket Name of bucket from which you want to remove specific file
 */
exports.removeFile = (filePath, bucket = null) => {
	const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: filePath };
	if (bucket) params.Bucket = bucket;
	return S3.deleteObject(params).promise();
};
