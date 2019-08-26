//Incluimos los modulos necesarios
var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var mongoose = require("mongoose");
var autoIncrement = require("mongodb-autoincrement");
var request = require('request');
var models = require('./models/models.exports');
var appRouters = require('./routers/routers.exports');

//Creamos el servidor
var app = express();

//Configuramos la conexión a la base de datos
mongoose.connect('mongodb://ismael:ismael1@ds129904.mlab.com:29904/restaurante', {
    useNewUrlParser: true
});

mongoose.connection.on('open', function () {
    console.log('--- Conectado correctamente con la base de datos Mongo ---');
    mongoose.set('useCreateIndex', true);
});

mongoose.plugin(autoIncrement);

//Configuramos la app
app.set("port", process.env.PORT || 3500)
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json());

//Creamos le enroutador
var router = new express.Router();

//Permitimos peticiones desde el origen
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
       next();
 });

  
//Asociamos el enrutador a la raiz
app.use("/categorias", appRouters.categoriasRouter);
app.use("/productos", appRouters.productosRouter);
app.use("/menus", appRouters.menusRouter);
app.use("/pedidos", appRouters.pedidosRouter);
//app.use("/", router);

//Ejecutamos el servidor
var server = app.listen(app.get("port"), function () {
    console.log("--- Servidor iniciado correctamente y escuchando en el puerto " + app.get("port") + "---");
});