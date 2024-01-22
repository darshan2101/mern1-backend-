"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// Associations
			models.user.hasMany(models.product, { foreignKey: "created_by_id" });

			models.user.belongsToMany(models.role, {
				through: "user_roles",
				foreignKey: "user_id",
				otherKey: "role_id",
			});

			models.user.hasOne(models.refreshToken, {
				foreignKey: "user_id",
				targetKey: "id",
			});
		}
	}

	User.init(
		{
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			is_deleted: DataTypes.BOOLEAN,
			deleted_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "user",
			timestamps: true, // Add this line to enable timestamps
			createdAt: "created_at", // If you want custom column names
			updatedAt: "updated_at",
		}
	);

	return User;
};
