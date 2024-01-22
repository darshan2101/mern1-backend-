"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/auth.config");

module.exports = (sequelize, DataTypes) => {
	class RefreshToken extends Model {
		static associate(models) {
			models.refreshToken.belongsTo(models.user, {
				foreignKey: "created_by_id",
				targetKey: "id",
			});
		}
	}

	RefreshToken.init(
		{
			token: DataTypes.STRING,
			expiryDate: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "refreshToken",
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);

	RefreshToken.createToken = async function (user) {
		let expiredAt = new Date();

		expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

		let _token = uuidv4();

		let refreshToken = await this.create({
			token: _token,
			userId: user.id,
			expiryDate: expiredAt.getTime(),
		});

		return refreshToken.token;
	};

	RefreshToken.verifyExpiration = (token) => {
		return token.expiryDate.getTime() < new Date().getTime();
	};

	return RefreshToken;
};
