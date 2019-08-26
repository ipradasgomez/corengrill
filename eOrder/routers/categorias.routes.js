var express = require("express");
var catController = require('../controllers/categoria.controller')
var categoriasRouter =  express.Router();

/*categoriasRouter.get("/productos/:catid", catController.getProducts);*/
categoriasRouter.get("/", catController.getAll);
categoriasRouter.get("/:id", catController.get);
categoriasRouter.post("/", catController.create);
categoriasRouter.delete("/:id", catController.delete);

module.exports = categoriasRouter;