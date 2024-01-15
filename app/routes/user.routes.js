const multer = require("multer");
const { authJwt } = require("../middleware");
const { upload } = require("../middleware/mutlerAuth");
const userController = require("../controllers/user.controller");
const fileController = require("../controllers/file.controller");
const productController = require("../controllers/product.controller");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"Authorization, Origin, Content-Type, Accept"
		);
		next();
	});

	app.get("/api/test/all", userController.allAccess);

	app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);

	app.get(
		"/api/test/mod",
		[authJwt.verifyToken, authJwt.isModerator],
		userController.moderatorBoard
	);

	app.get(
		"/api/test/admin",
		[authJwt.verifyToken, authJwt.isAdmin],
		userController.adminBoard
	);

	//file upload routes
	app.post("/api/upload", [authJwt.verifyToken], fileController.upload);
	app.get("/api/files", [authJwt.verifyToken], fileController.getListFiles);
	app.get("/api/files/:name", [authJwt.verifyToken], fileController.download);

	// product CRUD routes
	// Create a new Tutorial
	app.post(
		"/api/products/new",
		[authJwt.verifyToken],
		multer().single("file"),
		productController.createProduct
	);

	// Retrieve all Tutorials
	app.get(
		"/api/products/all",
		[authJwt.verifyToken],
		productController.getAllProduct
	);

	// Retrieve a single Tutorial with id
	app.get(
		"/api/products/:id",
		[authJwt.verifyToken],
		productController.getProduct
	);

	// Update a Tutorial with id
	app.put(
		"/api/products/update/:id",
		[authJwt.verifyToken],
		multer().single("file"),
		productController.updateProduct
	);

	// Delete a Tutorial with id
	app.delete(
		"/api/products/delete/:id",
		[authJwt.verifyToken],
		productController.deleteProduct
	);

	// Delete all Tutorials
	app.delete(
		"/api/products/delete/all",
		[authJwt.verifyToken],
		productController.deleteMultipleForUser
	);

	app.patch(
		"/api/products/restore/:id",
		[authJwt.verifyToken],
		productController.restoreProduct
	);

	// Delete all Tutorials
	app.patch(
		"/api/products/restore/all",
		[authJwt.verifyToken],
		productController.restoreMultipleForUser
	);
};
