var mongoose = require("mongoose");

var productoSchema = new mongoose.Schema({
    producto_id:{type:String, required:true, unique:true},
    producto_es: String,
    producto_en: String,
    opciones:[String],
    precio: Number,
    tipo_cantidad: String,
    id_categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categoria"
    }
});

//Validadores
productoSchema.path('producto_id').validate(function (n) {
    n = n.trim();
    return !!n;
}, 'Producto sin id');

productoSchema.path('id_categoria').validate(function (n) {
    //  n=n.trim();
    return !!n;
}, 'ID de categoría inválido');

productoSchema.path('precio').validate(function (n) {
    return !!n && n > 0;
}, 'Precio negativo');


module.exports = mongoose.model("producto", productoSchema);