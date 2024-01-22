"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			models.product.belongsTo(models.user, {
				foreignKey: "created_by_id",
				targetKey: "id",
			});
		}
	}
	Product.init(
		{
			name: DataTypes.STRING,
			image_file_name: DataTypes.STRING,
			image_content_type: DataTypes.STRING,
			image_updated_at: DataTypes.DATE,
			price: DataTypes.INTEGER,
			description: DataTypes.TEXT,
			is_deleted: DataTypes.BOOLEAN,
			deleted_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "product",
			timestamps: true, // Add this line to enable timestamps
			createdAt: "created_at", // If you want custom column names
			updatedAt: "updated_at",
		}
	);
	return Product;
};
