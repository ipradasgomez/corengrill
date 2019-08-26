var mongoose = require("mongoose");
var pedidoSchema = new mongoose.Schema({
    lineas_pedido: [
        //ejemplo1: Fingers de pollo, 3€, 3, []
        //Ejemplo con menus: Menu 1, 12€, 2, ["Plato1fijo", "Plato2opcion1", "Plato3opcion1"]
        //Ejemplo con menus: Menu 1, 12€, 2, ["Plato1fijo", "Plato2opcion2", "Plato3opcion1"]
        {
            "linea": Number,
            "producto": String,
            "precio": String,
            "cantidad": Number,
            "elecciones": [String]
        }
    ],
    estado: {
        type: String,
        default: "Pendiente",
        enum: ['Pendiente', 'Asignado', 'Finalizado'],
    }
});

module.exports = mongoose.model("pedido", pedidoSchema);