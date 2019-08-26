var models = require("../models/models.exports");
var Pedido = models.Pedido;
var ItemPedido = models.ItemPedido;
exports.getAll = function (req, res) {
    Pedido.find({}).exec()
        .then(founds => res.status(200).json(founds))
        .catch(() => res.status(404).json({
            "error": "Error obteniendo pedidos"
        }))
};

exports.get = function (req, res) {
    Pedido.findOne({
            _id: req.params.id
        }).exec()
        .then(found => {
            if (!found) {
                res.status(404).json({
                    "error": "Pedido no encontrado"
                })
            } else {
                res.status(200).json(found)
            }
        })
        .catch((err) => res.status(404).json({
            "error": "Error obteniendo pedidos"
        }));
};

exports.create = function (req, res) {
    var newElem = new Pedido({
        lineas_pedido: req.body.pedido,
        estado: "Pendiente",
    });
    newElem.save()
        .then(result => res.status(200).json(result))
        .catch(() => res.status(404).json({
            "error": "Error insertando pedido."
        }));

}

exports.delete = function (req, res) {
    Pedido.findOneAndDelete({
            _id: req.params.id
        }).exec()
        .then(removed => {
            if (removed) {
                res.status(200).json(removed);
            } else {
                res.status(404).json({
                    "error": "Pedido no encontrado"
                })
            }
        })
        .catch(err => res.status(404).json({
            "error": "Error obteniendo menú"
        }))
}

exports.update = function (req, res) {
    Pedido.updateOne({
        _id: req.params.id
    }, {
        $set: {
            estado: req.body.estado
        }
    }, function (err, result) {
        if (err) {
            res.status(400).json(err);
        } else {
            Pedido.findOne({}).exec()
                .then(founds => {
                    res.status(200).json(founds)
                })
                .catch(() => {
                    res.status(404).json({
                        "error": "Error obteniendo pedidos"
                    })
                })
        }

    })
}