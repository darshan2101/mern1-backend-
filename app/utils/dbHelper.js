/**
 * Get single record by id from given model
 * @param {*} id id of record
 * @param {*} isRaw Get raw data or sequelize object. default false
 * @param {*} fields List of fields we want to exclude
 */
exports.getRecordById = async function (id, isRaw = false, fields = []) {
	fields = typeof fields === "string" ? [fields] : fields;
	const MODEL = this;
	const where = { id, is_deleted: false };
	const _query = {
		where,
		attributes: { exclude: excludeFields(fields) },
		raw: isRaw,
	};
	return MODEL.findOne(_query);
};
