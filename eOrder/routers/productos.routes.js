var express = require("express");
var prodController = require('../controllers/producto.controller')
var productosRouter =  express.Router();

productosRouter.get("/", prodController.getAll);
productosRouter.get("/:id", prodController.get);
productosRouter.get("/categoria/:nombrecat", prodController.getFromCategory);
productosRouter.post("/", prodController.create);
productosRouter.delete("/:id", prodController.delete);

module.exports = productosRouter;