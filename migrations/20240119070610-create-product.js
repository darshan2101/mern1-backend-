"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("products", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			image_file_name: {
				type: Sequelize.STRING,
			},
			image_content_type: {
				type: Sequelize.STRING,
			},
			image_updated_at: {
				type: Sequelize.DATE,
			},
			price: {
				allowNull: false,
				type: Sequelize.INTEGER,
			},
			description: {
				type: Sequelize.TEXT,
			},
			is_deleted: {
				defaultValue: false,
				type: Sequelize.BOOLEAN,
			},
			deleted_at: {
				type: Sequelize.DATE,
			},
			created_at: {
				allowNull: false,
				defaultValue: new Date(),
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				defaultValue: new Date(),
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("products");
	},
};
