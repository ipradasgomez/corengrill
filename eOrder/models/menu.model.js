var mongoose = require("mongoose");
var menuSchema = new mongoose.Schema({
    menu_id:{type:String, required:true, unique:true},
    menu_es: String,
    menu_en: String,
    precio: String,
    componentes_es: [
        [String]
    ],
    componentes_en: [
        [String]
    ],
    num_personas:{type:Number, min:1}
});

module.exports = mongoose.model("menu", menuSchema);