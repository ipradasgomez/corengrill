var models = require("../models/models.exports");
var Categoria = models.Categoria;
var Producto = models.Producto;

exports.getAll = function (req, res) {
    Categoria.find({}).exec()
        .then(cats => res.status(200).json(cats))
        .catch(() => res.status(404).json({
            "error": "Error obteniendo categorías"
        }))
};

exports.get = function (req, res) {
    Categoria.find({
            categoria_id: req.params.id
        }).exec()
        .then(cat => {
            if (!cat) {
                res.status(404).json({
                    "error": "Categoría no encontrada"
                })
            } else {
                res.status(200).json(cat)
            }
        })
        .catch((err) => res.status(404).json({
            "error": "Error obteniendo categoría"
        }));
};

exports.create = function (req, res) {
    var newCat = new Categoria({
        categoria_id: req.body.categoria_id,
        categoria_es: req.body.categoria_es,
        categoria_en: req.body.categoria_en,
        descripcion_es: req.body.descripcion_es,
        descripcion_en:req.body.descripcion_en

    });
    newCat.save()
        .then(result => res.status(200).json(result))
        .catch(() => res.status(404).json({
            "error": "Error insertando categoría"
        }));
}

exports.delete = function (req, res) {
    Categoria.findOneAndDelete({
            categoria_id: req.params.id
        }).exec()
        .then(removed => {
            if (removed) {
                res.status(200).json(removed);
            } else {
                res.status(404).json({
                    "error": "Categoría no encontrada"
                })
            }
        })
        .catch(err => res.status(404).json({
            "error": "Error obteniendo categoría para eliminar"
        }))
}