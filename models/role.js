"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Role extends Model {
		static associate(models) {
			// define association here
			models.role.belongsToMany(models.user, {
				through: "user_roles",
				foreignKey: "role_id",
				otherKey: "user_id",
			});
		}
	}

	const roleFields = {
		name: DataTypes.STRING,
		is_deleted: DataTypes.BOOLEAN,
		deleted_at: DataTypes.DATE,
	};

	Role.init(roleFields, {
		sequelize,
		modelName: "role",
		timestamps: true, // Add this line to enable timestamps
		createdAt: "created_at", // If you want custom column names
		updatedAt: "updated_at",
	});

	return Role;
};
