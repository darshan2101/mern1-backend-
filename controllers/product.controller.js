const sharp = require("sharp");
const db = require("../models");
const { getSignedImageURL, uploadFile } = require("../services/aws");
const { excludeFields, toObject, formatDateToIST } = require("../utils/helper");
const Op = db.Sequelize.Op;
const Product = db.product;
const User = db.user;
const Role = db.role;

// Create and Save a new Product
const createProduct = async (req, res) => {
	try {
		const { name, price, description } = req.body;
		const created_by_id = req.userId;

		// console.log(JSON.stringify(req.file.originalname));
		// Check if all necessary fields are present
		if (!name || !price || !created_by_id) {
			return res
				.status(400)
				.json({ message: "Please provide all required fields." });
		}
		const file = req.file;
		// console.log(`\n file --> ${JSON.stringify(file.originalname)}`);
		if (!file) {
			return res
				.status(400)
				.json({ message: "Please provide Product Image File." });
		}

		// Check if the user (created_by_id) exists
		const user = await User.findByPk(created_by_id);
		if (!user) {
			return res.status(404).json({ message: "User not found." });
		}

		// Check if a product with the same name and created_by_id already exists
		const existingProduct = await Product.findOne({
			where: {
				name,
				created_by_id,
			},
		});

		if (existingProduct) {
			return res.status(400).json({
				message: "A product with the same name and creator already exists.",
			});
		}

		// Create the product with the uploaded file information
		const newProduct = await Product.create({
			name,
			price,
			description,
			created_by_id,
		});

		if (file) {
			// Upload logo of organization
			const thumbnail = await sharp(file.buffer).resize(100, 100).toBuffer();
			const originalFilePath = `products/${newProduct.id}/original/${file.originalname}`;
			const thumbnailFilePath = `products/${newProduct.id}/thumb/${file.originalname}`;

			await uploadFile(thumbnailFilePath, thumbnail, null, null, file.mimetype);
			await uploadFile(
				originalFilePath,
				file.buffer,
				null,
				null,
				file.mimetype
			);
			await Product.update(
				{
					image_file_name: file.originalname,
					image_content_type: file.mimetype,
					image_updated_at: new Date().toISOString(),
				},
				{ where: { id: newProduct.id } }
			);
		}

		return res.sendJson(200, "Product detail added successfully.", newProduct);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

// Function to check if a user has a specific role
const hasRole = async (userId, roleName) => {
	const userRoles = await User.findOne({
		where: { id: userId },
		include: [
			{ model: Role, attributes: ["name"], through: { attributes: [] } },
		],
	});

	return userRoles && userRoles.roles.some((role) => role.name === roleName);
};

const getPagination = (page, size) => {
	const limit = size ? +size : 5;
	const offset = page ? page * limit : 0;

	return { limit, offset };
};

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: products } = data;
	const currentPage = page ? +page : 0;
	const totalPages = Math.ceil(totalItems / limit);

	return { totalItems, products, totalPages, currentPage };
};

const getAllProduct = async (req, res) => {
	try {
		const { page, size, name } = req.query;
		const { limit, offset } = getPagination(page, size);

		// Check if the user has the 'admin' role
		const userId = req.userId;
		const isAdmin = await hasRole(userId, "admin");

		const condition = {
			where: {
				is_deleted: false,
				...(name ? { name: { [Op.like]: `%${name}%` } } : {}),
				...(isAdmin ? {} : { created_by_id: userId }),
			},
			attributes: {
				exclude: excludeFields(["image_content_type", "image_updated_at"]),
			},
		};

		// Retrieve products with pagination
		const products = await Product.findAndCountAll({
			...condition,
			limit,
			offset,
		});

		// Use Promise.all to parallelize the asynchronous operations
		const formattedProducts = await Promise.all(
			products.rows.map(async (product) => {
				let { image_file_name, id, created_at, ...restProduct } =
					toObject(product);

				const logo = image_file_name
					? await getSignedImageURL(`products/${id}/thumb/${image_file_name}`)
					: null;

				created_at = formatDateToIST(created_at);

				return { ...restProduct, id, logo, created_at };
			})
		);

		// Send paginated response
		const response = getPagingData(
			{ ...products, rows: formattedProducts },
			page,
			limit
		);
		res.status(200).json(response);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const getProduct = async (req, res) => {
	try {
		const userId = req.userId;
		const condition = {
			where: { is_deleted: false, id: req.params.id },
			attributes: {
				exclude: excludeFields(["image_content_type", "image_updated_at"]),
			},
		};
		const product = toObject(await Product.findOne(condition));

		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}
		// console.log(` \n product --> ${JSON.stringify(product)}`);

		product.logo = product.image_file_name
			? await getSignedImageURL(
					`products/${product.id}/original/${product.image_file_name}`
			  )
			: null;
		// : null;
		// console.log(`\n product after adding image --> ${JSON.stringify(product)}`);
		delete product.image_file_name;

		// console.log(
		// 	`\n product after removing imagefile name --> ${JSON.stringify(product)}`
		// );

		// Check if the user has the 'admin' role
		const isAdmin = await hasRole(userId, "admin");

		// If not admin and product is not created by the user, return unauthorized
		if (!isAdmin && product.created_by_id !== userId) {
			return res
				.status(403)
				.json({ message: "Unauthorized to access this product." });
		}

		return res.sendJson(200, "Product Details", product);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const updateProduct = async (req, res) => {
	try {
		const userId = req.userId;
		const _where = { is_deleted: false };
		const hasProduct = await Product.findOne({
			where: { id: req.params.id, ..._where },
		});

		const file = req.file;

		if (!userId) {
			return res.status(401).json({
				message: "UnAuthorized request made",
			});
		}

		if (!hasProduct) {
			return res.status(404).json({ message: "Product not found." });
		}

		// Check if the user has the 'admin' role
		const isAdmin = await hasRole(userId, "admin");

		if (!isAdmin && hasProduct.created_by_id !== userId) {
			// If not admin and product is not created by the user, return unauthorized
			return res
				.status(403)
				.json({ message: "Unauthorized to update this product." });
		}

		if (file) {
			// Upload logo of organization
			const thumbnail = await sharp(file.buffer).resize(100, 100).toBuffer();
			const originalFilePath = `products/${hasProduct.id}/original/${file.originalname}`;
			const thumbnailFilePath = `products/${hasProduct.id}/thumb/${file.originalname}`;

			await uploadFile(thumbnailFilePath, thumbnail, null, null, file.mimetype);
			await uploadFile(
				originalFilePath,
				file.buffer,
				null,
				null,
				file.mimetype
			);
			await hasProduct.update({
				image_file_name: file.originalname,
				image_content_type: file.mimetype,
				image_updated_at: new Date().toISOString(),
			});
		}

		// Update the product
		const updatedProduct = await hasProduct.update(req.body, {
			fields: ["name", "price", "description"],
		});

		return res.sendJson(
			200,
			"Product detail updated successfully.",
			updatedProduct
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const userId = req.userId;
		const productId = req.params.id;

		const product = await Product.findByPk(productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found." });
		}

		// Check if the user has the 'admin' role
		const isAdmin = await hasRole(userId, "admin");

		if (!isAdmin && product.created_by_id !== userId) {
			// If not admin and product is not created by the user, return unauthorized
			return res
				.status(403)
				.json({ message: "Unauthorized to delete this product." });
		}

		// Update the product to mark it as deleted
		await product.update({ is_deleted: true, deleted_at: new Date() });

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const deleteMultipleForUser = async (req, res) => {
	try {
		const userId = req.userId;
		const productIds = req.body.selection;

		// Check if the user has the 'admin' role
		const isAdmin = await hasRole(userId, "admin");

		if (isAdmin) {
			// Admin can soft delete all selected products
			await Product.update(
				{ is_deleted: true, deleted_at: new Date() },
				{ where: { id: productIds } }
			);
		} else {
			// Non-admin user can only delete their own products
			const userProductIds = await Product.findAll({
				where: { id: productIds, created_by_id: userId },
			});

			// Check if all selected productIds belong to the user
			if (userProductIds.length !== productIds.length) {
				return res
					.status(403)
					.json({ message: "Unauthorized to perform this action." });
			}

			// Soft delete the user's own products
			await Product.update(
				{ is_deleted: true, deleted_at: new Date() },
				{ where: { id: productIds, created_by_id: userId } }
			);
		}

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

const restoreProduct = async (req, res) => {
	try {
		const userId = req.userId;
		const productId = req.params.id;
		const product = Product.findByPk(productId);
		const isAdmin = await hasRole(userId, "admin");

		if (!isAdmin && product.created_by_id !== userId) {
			return res.status(403).json({ message: " Unauthorized to restore " });
		}

		await product.update({ is_deleted: false, deleted_at: null });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Internal server errror Something went wrong",
		});
	}
};

const restoreMultipleForUser = async (req, res) => {
	try {
		const userId = req.userId;
		const productIds = req.body.selection;

		// Check if the user has the 'admin' role
		const isAdmin = await hasRole(userId, "admin");

		if (isAdmin) {
			// Admin can soft delete all selected products
			await Product.update(
				{ is_deleted: false, deleted_at: null },
				{ where: { id: productIds } }
			);
		} else {
			// Non-admin user can only delete their own products
			const userProductIds = await Product.findAll({
				where: { id: productIds, created_by_id: userId },
			});

			// Check if all selected productIds belong to the user
			if (userProductIds.length !== productIds.length) {
				return res
					.status(403)
					.json({ message: "Unauthorized to perform this action." });
			}

			// Soft delete the user's own products
			await Product.update(
				{ is_deleted: false, deleted_at: null },
				{ where: { id: productIds, created_by_id: userId } }
			);
		}

		res.status(204).send();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = {
	createProduct,
	getAllProduct,
	getProduct,
	updateProduct,
	deleteProduct,
	deleteMultipleForUser,
	restoreProduct,
	restoreMultipleForUser,
};
