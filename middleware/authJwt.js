const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const { toObject } = require("../utils/helper.js");
const User = db.user;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
	if (err instanceof TokenExpiredError) {
		return res
			.status(401)
			.send({ message: "Unauthorized! Access Token was expired!" });
	}

	return res.sendStatus(401).send({ message: "Unauthorized!" });
};

const verifyToken = (req, res, next) => {
	let token = req.headers.authorization;

	console.log("Authorization Header:", token);

	if (!token) {
		return res.status(403).send({
			message: "No token provided!",
		});
	}

	jwt.verify(token, config.secret, async (err, decoded) => {
		if (err) {
			console.error("Token Verification Error:", err);
			return catchError(err, res);
		}
		try {
			const user = await User.findByPk(decoded.id);
			if (!user) {
				return res.status(404).send({ message: "User not found!" });
			}

			req.user = toObject(user); // Convert user to plain JavaScript object if needed
			req.userId = decoded.id;
			next();
		} catch (error) {
			console.error("Error fetching user:", error);
			return res.status(500).send({ message: "Internal Server Error" });
		}
	});
};

const isAdmin = (req, res, next) => {
	User.findByPk(req.userId).then((user) => {
		user.getRoles().then((roles) => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "admin") {
					next();
					return;
				}
			}

			res.status(403).send({
				message: "Require Admin Role!",
			});
			return;
		});
	});
};

const isModerator = (req, res, next) => {
	User.findByPk(req.userId).then((user) => {
		user.getRoles().then((roles) => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "moderator") {
					next();
					return;
				}
			}

			res.status(403).send({
				message: "Require Moderator Role!",
			});
		});
	});
};

const isModeratorOrAdmin = (req, res, next) => {
	User.findByPk(req.userId).then((user) => {
		user.getRoles().then((roles) => {
			for (let i = 0; i < roles.length; i++) {
				if (roles[i].name === "moderator") {
					next();
					return;
				}

				if (roles[i].name === "admin") {
					next();
					return;
				}
			}

			res.status(403).send({
				message: "Require Moderator or Admin Role!",
			});
		});
	});
};

const authJwt = {
	verifyToken: verifyToken,
	isAdmin: isAdmin,
	isModerator: isModerator,
	isModeratorOrAdmin: isModeratorOrAdmin,
};
module.exports = authJwt;
