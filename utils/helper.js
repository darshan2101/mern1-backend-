const path = require("path");
const moment = require("moment");
const {
	FILE_SIZE,
	IMAGE_SIZE,
	VIDEO_SIZE,
	FILE_EXTENSIONS,
} = require("./enums");

exports.toObject = (json) => JSON.parse(JSON.stringify(json));

/**
 * Test case response required check
 */
exports.parsedData = (res) => JSON.parse(res.text);

/**
 *
 * @param {*} string string who's first letter we want as capitalize
 */
exports.capitalize = (string) =>
	string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

exports.excludeFields = (keys, isDefault = true) => {
	keys = typeof keys === "string" ? [keys] : keys || [];
	const defaultFields = ["is_deleted", "updated_at", "deleted_at"];
	if (isDefault) keys = keys.concat(defaultFields);
	return keys;
};

/**
 * Return pagination params
 * @param currentPage Current page number
 * @param count Total number of records
 * @param perPage Number of record you want in single page
 */
exports.paginate = ({
	currentPage = 1,
	count = 0,
	perPage = process.env.DEFAULT_PER_PAGE_RECORD,
}) => {
	currentPage = Number(currentPage);
	const pageCount = count != 0 ? Math.ceil(count / Number(perPage)) : 1;
	const offset = (currentPage ? Number(currentPage) - 1 : 0) * Number(perPage);
	const limit = Number(perPage);
	return { currentPage, pageCount, offset, limit, perPage };
};

exports.formatDateToIST = (utcDateString) => {
	const inputDate = new Date(utcDateString);

	const options = {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		hour12: true,
		timeZone: "Asia/Kolkata", // Set to Indian Standard Time
	};

	return inputDate.toLocaleString("en-IN", options);
};

/**
 * validate attachment extensions and size
 * @param {*} file
 */
exports.validAttachment = (file) => {
	const ext = path
		.parse(file.originalname)
		.ext.match(FILE_EXTENSIONS.EXT_ATTACHMENTS);
	if (ext) {
		switch (ext[1]) {
			case "png":
			case "jpeg":
			case "jpg":
			case "PNG":
			case "JPEG":
			case "JPG":
				if (file.size > IMAGE_SIZE.BYTES)
					throw new APIError({
						status: 422,
						data: "Image size should be less than 10 MB",
					});
				break;
			case "doc":
			case "docx":
			case "pdf":
			case "csv":
			case "txt":
			case "xls":
			case "xlsx":
			case "DOC":
			case "DOCX":
			case "PDF":
			case "CSV":
			case "TXT":
			case "XLS":
			case "XLSX":
				if (file.size > FILE_SIZE.BYTES)
					throw new APIError({
						status: 422,
						data: "File size should be less than 3 MB",
					});
				break;
			case "mp4":
			case "mkv":
			case "mov":
			case "avi":
			case "wmv":
			case "webm":
			case "MP4":
			case "MKV":
			case "MOV":
			case "AVI":
			case "WMV":
			case "WEBM":
				if (file.size > VIDEO_SIZE.BYTES)
					throw new APIError({
						status: 422,
						data: "Video size should be less than 50 MB",
					});
				break;
			default:
				throw new APIError({
					status: 422,
					data: "Please select jpg, png, pdf, doc, xls, text, csv files only",
				});
		}
	} else
		throw new APIError({
			status: 422,
			data: "Please select jpg, png, pdf, doc, xls, text, csv files only",
		});
};

/**
 *  Get age for given birthdate billing excel
 * @param {*} birthdate
 */
exports.getAge = (birthdate) => {
	birthdate = moment(birthdate, "DD/MM/YYYY");
	birthdate = moment(birthdate).format("MM/DD/YYYY");

	const today = moment(new Date());
	const birthDate = moment(birthdate);

	if (today.diff(birthDate, "years") > 0)
		return String(today.diff(birthDate, "years")).concat(" Years");
	else if (today.diff(birthDate, "months") > 0)
		return String(today.diff(birthDate, "months")).concat(" Month");
	else return String(today.diff(birthDate, "days")).concat(" Day");
};

/**
 * Convert date in to ISO format
 * @param {*} date
 */
exports.convertToISODate = (date) => {
	if (patterns.isISODate.test(date)) return date;
	else if (moment(date, "DD-MM-YYYY", true).isValid())
		return new Date(moment(date, "DD-MM-YYYY")).toISOString();
	else if (moment(date, "DD/MM/YYYY", true).isValid())
		return new Date(moment(date, "DD/MM/YYYY")).toISOString();
	else if (moment(date, "YYYY/MM/DD", true).isValid())
		return new Date(moment(date, "YYYY/MM/DD")).toISOString();
	else if (moment(date, "YYYY-MM-DD", true).isValid())
		return new Date(moment(date, "YYYY-MM-DD")).toISOString();
	else if (/UTC/.test(date)) return new Date(date).toISOString();
};
