var models = require("../models/models.exports");
var Menu = models.Menu;

exports.getAll = function (req, res) {
    Menu.find({}).exec()
        .then(founds => res.status(200).json(founds))
        .catch(() => res.status(404).json({
            "error": "Error obteniendo menús"
        }))
};

exports.get = function (req, res) {
    Menu.findOne({
            menu_id: req.params.id
        }).exec()
        .then(found => {
            if (!found) {
                res.status(404).json({
                    "error": "Menú no encontrado"
                })
            } else {
                res.status(200).json(found)
            }
        })
        .catch((err) => res.status(404).json({
            "error": "Error obteniendo menú"
        }));
};


exports.create = function (req, res) {
    var newElem = new Menu({
        menu_id: req.body.menu_id,
        menu_es: req.body.menu_es,
        menu_en: req.body.menu_en,
        precio: req.body.precio,
        componentes_es: req.body.componentes_es,
        componentes_en: req.body.componentes_en,
        num_personas: req.body.num_personas
    });
    newElem.save()
        .then(result => res.status(200).json(result))
        .catch(() => res.status(404).json({
            "error": "Error insertando menú"
        }));

}

exports.delete = function (req, res) {
    Menu.findOneAndDelete({menu_id:req.params.id}).exec()
        .then(removed => {
            if (removed) {
                res.status(200).json(removed);
            } else {
                res.status(404).json({
                    "error": "Menú no encontrado"
                })
            }
        })
        .catch(err => res.status(404).json({
            "error": "Error obteniendo menú"
        }))
}