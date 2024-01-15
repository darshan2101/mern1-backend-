const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

let upload = multer({ storage: storage, fileFilter: fileFilter }).single(
	"file"
);

module.exports = {
	upload,
};
