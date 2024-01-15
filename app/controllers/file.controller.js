const processFile = require("../middleware/upload");
const gcsService = require("../services/google_cloud"); // Assuming you named the file gcsService.js

const upload = async (req, res) => {
	try {
		await processFile(req, res);

		if (!req.file) {
			return res.status(400).send({ message: "Please upload a file!" });
		}

		const blobName = req.file.originalname;
		const contentType = req.file.mimetype;
		const fileBuffer = req.file.buffer;

		await gcsService.uploadFile(
			blobName,
			fileBuffer,
			null,
			"public-read",
			contentType
		);

		const publicUrl = await gcsService.getSignedURL(blobName);

		res.status(200).send({
			message: `Uploaded the file successfully: ${blobName}`,
			url: publicUrl,
		});
	} catch (err) {
		if (err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).send({
				message: "File size cannot be larger than 10MB!",
			});
		}

		res.status(500).send({
			message: `Could not upload the file: ${req.file.originalname}. ${err}`,
		});
	}
};

/**
 * Retrieves a list of files from a Google Cloud Storage bucket and generates signed URLs for each file.
 * @param {object} req - The request object containing information about the HTTP request.
 * @param {object} res - The response object used to send the HTTP response.
 */
const getListFiles = async (req, res) => {
	try {
		const files = await gcsService.listObject("");
		const fileInfos = [];

		for (const file of files) {
			const url = await gcsService.getSignedURL(file.name);
			fileInfos.push({
				name: file.name,
				url: url,
			});
			console.log(`\n file --> ${file.name} --> ${url}`);
		}

		res.status(200).send(fileInfos);
	} catch (err) {
		console.log(err);
		res.status(500).send({
			message: "Unable to read list of files!",
		});
	}
};

module.exports = getListFiles;

const download = async (req, res) => {
	try {
		const fileName = req.params.name;
		const fileBuffer = await gcsService.getObject(fileName);

		res.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename=${fileName}`,
		});

		res.end(fileBuffer);
	} catch (err) {
		res.status(500).send({
			message: "Could not download the file. " + err,
		});
	}
};

module.exports = {
	upload,
	getListFiles,
	download,
};
