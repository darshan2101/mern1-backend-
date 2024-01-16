const { excludeFields, paginate, removeFields } = require("../utils/helper");
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

/**
 * Pagination logic
 * @param {*} queryParams
 * @param {*} condition
 */
exports.pagination = async function (
	queryParams,
	condition = {},
	options = { defaultOrder: true }
) {
	try {
		const MODEL = this;
		const count = await MODEL.findAll(condition);

		const paginateParams = {
			count: count.length,
			currentPage: queryParams.page || 1,
			perPage: queryParams.per_page || count.length,
		};

		const { limit, offset, pageCount } = paginate(paginateParams);

		const order = [
			[queryParams.order_by || "created_at", queryParams.order || "DESC"],
		];
		condition = options.defaultOrder
			? { ...condition, limit, offset, order }
			: { ...condition, limit, offset };

		const rows = await MODEL.findAll(condition);
		return {
			results: rows || [],
			pages: pageCount || 1,
			count: count.length || 0,
		};
	} catch (error) {
		return error;
	}
};
