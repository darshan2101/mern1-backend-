exports.toObject = (json) => JSON.parse(JSON.stringify(json));
exports.excludeFields = (keys, isDefault = true) => {
	keys = typeof keys === "string" ? [keys] : keys || [];
	const defaultFields = ["is_deleted", "updated_at", "deleted_at"];
	if (isDefault) keys = keys.concat(defaultFields);
	return keys;
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
