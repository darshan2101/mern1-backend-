const db = require("../models/index");
const ROLES = ["user", "admin", "moderator"];
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
	// Username
	console.log(`req --> ${JSON.stringify(req.body)}`);
	User.findOne({
		where: {
			username: req.body.username,
		},
	}).then((user) => {
		if (user) {
			res.status(400).send({
				message: "Failed! Username is already in use!",
			});
			return;
		}
		console.log("\n username check done");
		// Email
		User.findOne({
			where: {
				email: req.body.email,
			},
		}).then((user) => {
			if (user) {
				res.status(400).send({
					message: "Failed! Email is already in use!",
				});
				return;
			}
			console.log("\nunique fact checked");
			next();
		});
	});
};

checkRolesExisted = (req, res, next) => {
	console.log("\nrole check init");
	if (req.body.roles) {
		for (let i = 0; i < req.body.roles.length; i++) {
			if (!ROLES.includes(req.body.roles[i])) {
				res.status(400).send({
					message: "Failed! Role does not exist = " + req.body.roles[i],
				});
				return;
			}
		}
	}
	console.log("\nrole check done");
	next();
};

const verifySignUp = {
	checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
	checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
