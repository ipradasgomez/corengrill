var mongoose = require("mongoose");

var categoriaSchema = new mongoose.Schema({
    categoria_id:{type:String, required:true,unique:true},
    categoria_es: {type:String,required:true},
    categoria_en: {type:String,required:true},
    descripcion_es: String,
    descripcion_en:String
}); 

categoriaSchema.path('categoria_id').validate(function(n) {
    n=n.trim();
    return !!n;
}, 'Categoría sin nombre');

module.exports = mongoose.model("categoria", categoriaSchema);