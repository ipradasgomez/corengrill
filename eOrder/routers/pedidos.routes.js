var express = require("express");
var pedidosController = require('../controllers/pedido.controller')
var pedidoRouter =  express.Router();

pedidoRouter.get("/", pedidosController.getAll);
pedidoRouter.get("/:id", pedidosController.get);
pedidoRouter.post("/", pedidosController.create);
pedidoRouter.delete("/:id", pedidosController.delete);
pedidoRouter.put("/:id", pedidosController.update);

module.exports = pedidoRouter;