const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.PORT),
			secure: Boolean(process.env.SECURE),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});
		transporter.verify((error, success) => {
			if (error) {
				console.log(error);
			} else {
				console.log("Server is ready to take our messages");
			}
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: "Test Mail from APEX",
			text: "Test mail from Apex corp to test email function",
		});
	} catch (error) {
		console.log(`Email sent Failed --> ${error.message}`);
	}
};

// let mailTransporter = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 		type: "OAuth2",
// 		user: "dgbabariya305@gmail.com",
// 		pass: "believeyourself",
// 		clientId:
// 			"844828866468-mdsb77vjkh1tueks6m7skcgv2okgjo9i.apps.googleusercontent.com",
// 		clientSecret: "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",
// 		refreshToken:
// 			"1//04yIjzgLTfQXTCgYIARAAGAQSNwF-L9IrWMw-2Obor0xNfclDhp7XN_-3M1IIPj1Qi22WX8gbQ-4J7xoynjlEdkL58Uql1CMcw0I",
// 	},
// });
