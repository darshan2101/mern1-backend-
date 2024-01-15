module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define("products", {
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		image_file_name: {
			type: Sequelize.STRING,
		},
		image_content_type: {
			type: Sequelize.STRING,
		},
		image_updated_at: {
			type: Sequelize.DATE,
		},
		price: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		description: {
			type: Sequelize.TEXT,
		},
		is_deleted: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		},
		deleted_at: {
			type: Sequelize.DATE,
		},
		created_by_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	});

	return Product;
};
