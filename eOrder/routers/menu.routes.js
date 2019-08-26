var express = require("express");
var menuController = require('../controllers/menu.controller')
var menuRouter =  express.Router();

menuRouter.get("/", menuController.getAll);
menuRouter.get("/:id", menuController.get);
menuRouter.post("/", menuController.create);
menuRouter.delete("/:id", menuController.delete);

module.exports = menuRouter;