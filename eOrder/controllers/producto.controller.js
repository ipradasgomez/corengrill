var models = require("../models/models.exports");
var Producto = models.Producto;
var Categoria = models.Categoria;

exports.getAll = function (req, res) {
    Producto.find({}).exec()
        .then(founds => res.status(200).json(founds))
        .catch(() => res.status(404).json({
            "error": "Error obteniendo productos"
        }))
};

exports.get = function (req, res) {
    Producto.find({producto_id:req.params.id}).exec()
        .then(found => {
            if (!found) {
                res.status(404).json({
                    "error": "Producto no encontrado"
                })
            } else {
                res.status(200).json(found)
            }
        })
        .catch((err) => res.status(404).json({
            "error": "Error obteniendo producto"
        }));
};

exports.getFromCategory = function (req, res) {
    Categoria.findOne({
            categoria_id:req.params.nombrecat
        }).exec()
        .then(cat => {
            if (cat) {
                Producto.find({id_categoria: cat}).exec()
                    .then(found => {
                        if (!found) {
                            res.status(404).json({
                                "error": "Producto no encontrado"
                            })
                        } else {
                            res.status(200).json(found)
                        }
                    })
                    .catch((err) => res.status(404).json({
                        "error": "Error obteniendo producto"
                    }));
            } else {
                res.status(404).json({
                    "error": "Categoría no encontrada"
                })
            }
        })
};

exports.create = function (req, res) {
    var newElem = new Producto({
        producto_id:req.body.producto_id,
        producto_es: req.body.producto_es,
        producto_en: req.body.producto_en,
        opciones:req.body.opciones,
        precio: req.body.precio,
        tipo_cantidad: req.body.tipo_cantidad,
    });
    Categoria.findOne({categoria_id:req.body.id_categoria}).exec()
        .then(cat => {
            if (cat) {
                var newElem = new Producto({
                    producto_id:req.body.producto_id,
                    producto_es: req.body.producto_es,
                    producto_en: req.body.producto_en,
                    opciones:req.body.opciones,
                    precio: req.body.precio,
                    tipo_cantidad: req.body.tipo_cantidad,
                    id_categoria:cat
                });
                newElem.validate((err) => {
                    if (err) {
                        res.status(404).json({
                            "error": err
                        })
                    } else {
                        newElem.save()
                            .then(result => res.status(200).json(result))
                            .catch(() => res.status(404).json({
                                "error": "Error insertando producto"
                            }));
                    }
                });
            } else {
                res.status(404).json({
                    "error": "Categoría no encontrada. producto no insertado"
                })
            }
        })


}

exports.delete = function (req, res) {
    Producto.findOneAndDelete({producto_id:req.params.id}).exec()
        .then(removed => {
            if (removed) {
                res.status(200).json(removed);
            } else {
                res.status(404).json({
                    "error": "Producto no encontrado"
                })
            }
        })
        .catch(err => res.status(404).json({
            "error": "Error obteniendo productos"
        }))
}