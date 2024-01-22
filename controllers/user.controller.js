const { User, Product, sequelize } = require("../models");

exports.allAccess = (req, res) => {
	res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
	res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
	res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
	res.status(200).send("Moderator Content.");
};

exports.deleteUser = async (req, res) => {
	const userId = req.userId;
	await User.update(
		{ is_deleted: true, deleted_at: new Date() },
		{ where: { id: userId } }
	);
	await await Product.update(
		{ is_deleted: true, deleted_at: new Date() },
		{ where: { created_by_id: userId, is_deleted: false } }
	);

	res.status(200).send({ message: "User Account and product removed" });
};
exports.deleteUser = async (req, res) => {
	const userId = req.userId;

	// Begin a transaction to ensure atomicity
	const transaction = await sequelize.transaction();

	try {
		// Update the 'users' table
		await User.update(
			{ is_deleted: true, deleted_at: new Date() },
			{ where: { id: userId }, transaction }
		);

		// Update the 'products' table
		await Product.update(
			{ is_deleted: true, deleted_at: new Date() },
			{ where: { created_by_id: userId, is_deleted: false }, transaction }
		);

		// Delete entries from the 'user_roles' table
		await sequelize.query("DELETE FROM user_roles WHERE user_id = :userId", {
			replacements: { userId },
			type: sequelize.QueryTypes.DELETE,
			transaction,
		});

		// Commit the transaction
		await transaction.commit();

		res
			.status(200)
			.send({ message: "User Account, products, and related roles removed" });
	} catch (error) {
		// Rollback the transaction in case of an error
		await transaction.rollback();

		console.error(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
};
