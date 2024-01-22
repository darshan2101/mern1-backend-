require("dotenv").config();
module.exports = {
	database: {
		development: {
			host: process.env.DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			db_name: process.env.DB_NAME,
			dialect: "mysql",
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
		test: {
			host: process.env.DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			db_name: process.env.TEST_DB_NAME,
			dialect: "mysql",
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
		production: {
			host: process.env.PROD_DB_HOST,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			db_name: process.env.PROD_DB_HOST,
			dialect: "mysql",
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
	},
};
