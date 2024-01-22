"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		// seed roles user, moderator, and admin
		await queryInterface.bulkInsert("roles", [
			{
				name: "user",
				is_deleted: false,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "moderator",
				is_deleted: false,
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				name: "admin",
				is_deleted: false,
				created_at: new Date(),
				updated_at: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("roles", {
			name: ["user", "moderator", "admin"],
			is_deleted: false,
		});
	},
};
