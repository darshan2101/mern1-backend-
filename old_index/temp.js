// const config = require("../config/db.config.js");

// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
// 	config.database.development.DB,
// 	config.database.development.USER,
// 	config.database.development.PASSWORD,
// 	{
// 		host: config.database.development.HOST,
// 		dialect: config.database.development.dialect,
// 		pool: config.database.development.pool,
// 	}
// );

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.user = require("../models/user.model.js")(sequelize, Sequelize);
// db.role = require("../models/role.model.js")(sequelize, Sequelize);
// db.product = require("../models/product.model.js")(sequelize, Sequelize);
// db.refreshToken = require("../models/refreshToken.model.js")(
// 	sequelize,
// 	Sequelize
// );

// db.product.belongsTo(db.user, { foreignKey: "created_by_id", targetKey: "id" });

// db.user.hasMany(db.product, { foreignKey: "created_by_id" });

// db.role.belongsToMany(db.user, {
// 	through: "user_roles",
// 	foreignKey: "roleId",
// 	otherKey: "userId",
// });

// db.user.belongsToMany(db.role, {
// 	through: "user_roles",
// 	foreignKey: "userId",
// 	otherKey: "roleId",
// });

// db.refreshToken.belongsTo(db.user, {
// 	foreignKey: "userId",
// 	targetKey: "id",
// });
// db.user.hasOne(db.refreshToken, {
// 	foreignKey: "userId",
// 	targetKey: "id",
// });

// db.ROLES = ["user", "admin", "moderator"];

// module.exports = db;
