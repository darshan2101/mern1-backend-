const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
	projectId: process.env.GCLOUD_PROJECT_ID,
	keyFilename: path.join(__dirname, "../../google-cloud-key.json"),
});

/**
 * Generate signed URL from Google Cloud Storage
 * @param {string} filePath File path of accessing file
 * @param {string} bucket Name of the bucket
 * @param {number} time Expiration time in seconds
 */
exports.getSignedURL = (filePath, bucket = null, time = 30000) => {
	const options = {
		version: "v4",
		action: "read",
		expires: Date.now() + time,
	};

	const file = storage
		.bucket(bucket || process.env.GCLOUD_STORAGE_BUCKET_NAME)
		.file(filePath);

	return file.getSignedUrl(options);
};

/**
 * Upload file on Google Cloud Storage
 * @param {string} filePath Address of file
 * @param {buffer} image Image data
 * @param {string} bucket Name of the bucket
 * @param {string} acl Type of access control like `private`, `public-read`, `public-read-write`
 * @param {string} contentType File content type like `application/pdf`, `image/jpg`, `image/png`
 */
exports.uploadFile = async (
	filePath,
	image,
	bucket = null,
	acl = "private",
	contentType = null
) => {
	const options = {
		metadata: {
			contentType: contentType || "application/octet-stream",
		},
		public: acl === "public-read" || acl === "public-read-write",
	};

	const file = storage
		.bucket(bucket || process.env.GCLOUD_STORAGE_BUCKET_NAME)
		.file(filePath);

	await file.save(image, options);

	return file;
};

/**
 * Get Google Cloud Storage file object buffer
 * @param {string} filePath Address of file
 * @param {string} bucket Name of the bucket
 */
exports.getObject = async (filePath, bucket = null) => {
	const file = storage
		.bucket(bucket || process.env.GCLOUD_STORAGE_BUCKET_NAME)
		.file(filePath);

	const data = await file.download();

	return data[0];
};

/**
 * Check if the given path exists in Google Cloud Storage
 * @param {string} filePath Address of file
 * @param {string} bucket Name of the bucket
 */
exports.listObject = async (filePath, bucket = null) => {
	const options = {
		prefix: filePath,
	};

	const [files] = await storage
		.bucket(bucket || process.env.GCLOUD_STORAGE_BUCKET_NAME)
		.getFiles(options);

	return files;
};

/**
 * Upload base64 file on Google Cloud Storage
 * @param {string} filePath Address of file
 * @param {string} image Image data in base64 format
 * @param {string} bucket Name of the bucket
 */
exports.uploadBase64File = async (filePath, image, bucket = null) => {
	const buffer = Buffer.from(image, "base64");
	const options = {
		metadata: {
			contentType: "application/octet-stream",
		},
	};

	const file = storage
		.bucket(bucket || process.env.GCLOUD_STORAGE_BUCKET_NAME)
		.file(filePath);

	await file.save(buffer, options);

	return file;
};

/**
 * Remove file from Google Cloud Storage
 * @param {string} filePath Address of file which you want to delete
 * @param {string} bucket Name of the bucket
 */
exports.removeFile = async (filePath, bucket = null) => {
	const file = storage
		.bucket(bucket || process.env.GCLOUD_STORAGE_BUCKET_NAME)
		.file(filePath);

	await file.delete();

	return true;
};
