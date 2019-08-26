Plantillas = {
    cardProducto: function (producto) {
        return `
    <div class="col-12 col-md-3 col-lg-4 productbox d-flex flex-column">
    <img class="img-responsive img-fluid img-thumbnail product-img" src="./images/products/` + producto.producto_id + `.jpg">
    <div class="producttitle d-flex justify-content-between"><div>` + producto.producto_es + `</div><div class="text-nowrap"><small>` + producto.tipo_cantidad + `</small></div></div>
    <div class="cardSpacer"></div>
    <div class="productprice d-flex justify-content-between">
         <div class="pull-right"><a href="#" class="btn btn-danger btn-sm addProduct" data-nombre="` + producto.producto_es + `" data-ud="` + producto.tipo_cantidad + `" data-precio="` + producto.precio + `" role="button">Añadir</a></div>
        <div class="pricetext">` + parseFloat(producto.precio).toFixed(2) + `€</div>
     </div>
    </div>
`;
    },
    cardMenu: function (menu) {
        var pers = "";
        for (var i = 0; i <= menu.num_personas; i++) {

        }
        return `
    <div class="col-12 col-md-6 col-lg-6 productbox d-flex flex-column">
    <img class="img-responsive img-fluid img-thumbnail product-img" src="./images/products/` + menu.menu_id + `.jpg">
    <div class="producttitle d-flex justify-content-between"><div><span>` + menu.menu_es + `</span></div><div class="text-nowrap"><small>` + menu.num_personas + `<img class="numPersonas" src="./images/person.jpg"/></small></div></div>
    <div class="componentes-box"><small><em>` + this.menuComponentesToSring(menu.componentes_es) + `</em></small></div>    
    <div class="productprice d-flex justify-content-center">
    ` + this.generateSelectableForms(menu.menu_id, menu.componentes_es) + `
     </div>
     <div class="productprice d-flex justify-content-between">
     <div class="pull-right"><a href="#" class="btn btn-danger btn-sm addProduct" data-nombre="` + menu.menu_es + `" data-id="` + menu.menu_id + `" data-precio="` + menu.precio + `" role="button">Añadir</a></div>
    <div class="pricetext">` + parseFloat(menu.precio).toFixed(2) + ` €</div>
 </div>
    </div>
`;
    },
    menuComponentesToSring: function (arrComponentes) {
        var str = "";
        for (let compo of arrComponentes) {
            if (typeof compo === String) {
                str += compo + ", ";
            } else {
                str += compo.join(" o ");
                str += ", ";
            }
        }
        return str.substring(0, str.length - 2) + ".";
    },
    generateSelectableForms: function (menuid, arrComponentes) {
        var str = '<form id="form-' + menuid + '" class="col-12">';
        var i = 1;
        for (let compo of arrComponentes) {
            if (compo.length > 1) {
                var j = 1;
                str += '<select id="' + menuid + '-comps-' + i + '" class="custom-select col-12" id="inlineFormCustomSelect">';
                for (let subArr of compo) {
                    str += '<option value="' + menuid + '-comp' + i + '-opt' + j + '">' + subArr + '</option>';
                    j++;
                }
                str += "</select>";
            }

            i++;
        }
        return str + "</form>";
    },
    listItemCategoria: function (categoria) {
        return `
    <a href="#" data-cat="` + categoria.categoria_id + `" class="cat-link">
        <li class="list-group-item d-flex align-items-center p-0">
            <img class="mr-1 img-fluid img-thumbnail" style="height:40px" src="./images/categorias/` + categoria.categoria_id + `.png" />
            <em><b>` + categoria.categoria_es + `</b></em>
        </li>
    </a>
    <hr />`;
    },
    itemPedidoSimple: function (lineaPedido) {
        var result = "";
        if (lineaPedido.elecciones.length > 0) {
            result = '<div class="ml-4"><ul class="orders mb-0 ">';
            for (let eleccion of lineaPedido.elecciones) {
                result += '<li><small>' + eleccion + '</small></li>';
            }
            result += "</ul></div>";
        }
        return `
        <li class="list-group-item p-0 align-items-center">
            <div class="d-flex justify-content-between">
                <div>
                    <span class="badge badge-primary badge-pill">` + lineaPedido.cantidad + `</span>
                    <b>` + lineaPedido.producto + `</b>
                </div>
                <div>
                    <span name="oneMore" class="badge badge-success badge-pill" data-lid="` + (parseInt(lineaPedido.linea) - 1) + `">+</span>
                    <span name="oneLess" class="badge badge-danger badge-pill" data-lid="` + (parseInt(lineaPedido.linea) - 1) + `">-</span>
                </div>
            </div>
            ` + result + `          
            <ul class="m-0">
                <li class="list-group-item text-right m-0 p-0"><span id="price">` + parseFloat(lineaPedido.precio).toFixed(2) + `€</span></li>
            </ul>
        </li>
        <hr>
        `;
    },
    itemPedidoPrecioTotal: function (precio) {
        return `
        <li class="list-group-item text-right">
            <b>Total:</b> <span id="price">` + precio + `€</span>
        </li>
        `;
    },
    representaPedido: function () {
        var listaPedidos = document.getElementById("resumenPedido");
        listaPedidos.innerHTML = "";
        Comandero.Pedido.forEach(linea => {
            listaPedidos.innerHTML = listaPedidos.innerHTML + Plantillas.itemPedidoSimple(linea);
        })
        document.getElementById("precioTotal").innerHTML = Plantillas.itemPedidoPrecioTotal(Comandero.precioTotalPedido());
    WebFunctions.addPlusAndMinusClicks();
    },
};
Comandero = {
    Pedido: [],
    reset: function () {
        this.Pedido = [];
        Plantillas.representaPedido();
    },
    insertaProductoPedido: function (prodA) {
        var productoEncontrado = this.Pedido.filter(function (p) {
            return p.producto == prodA.producto;
        });
        if (productoEncontrado.length > 0) {
            //Obtenemos del arrays de productos encontrados aquellos que tengan las mismas elecciones
            var productosConMismasElecciones = productoEncontrado.filter(function (p) {
                return Comandero.pedidoTieneEleccionesIguales(p.elecciones, prodA.elecciones);
            });
            //Sobre el obtenido (debe ser uno), aumentamos su cantidad si no, es que no hay iguales, insertamos
            if (productosConMismasElecciones.length > 0) {
                productosConMismasElecciones[0].cantidad++;
            } else {
                this.Pedido.push(prodA);
            }
        } else {
            //Si no existe, lo insertamos
            this.Pedido.push(prodA);
        }
        Plantillas.representaPedido();

    },
    pedidoTieneEleccionesIguales: function (elecciones1, elecciones2) {
        if (elecciones1.length != elecciones2.length) {
            return false;
        } else {
            elecciones1.sort();
            elecciones2.sort();
            return elecciones1.toString() == elecciones2.toString();
        }
    },
    precioTotalPedido: function () {
        return this.Pedido.reduce(function (total, pedido) {
            return total + (pedido.cantidad * pedido.precio);
        }, 0).toFixed(2);
    },
    unoMasDe: function (id) {
        Comandero.Pedido[id].cantidad++;
        Plantillas.representaPedido();
    },
    unoMenosDe: function (id) {
        Comandero.Pedido[id].cantidad--;
        if( Comandero.Pedido[id].cantidad<=0){
            Comandero.Pedido.splice(id, 1);
        }
        Plantillas.representaPedido();
    }
};


WebFunctions = {
    addCategoriasClicks: function () {
        var cats = document.getElementsByClassName("cat-link");
        for (let cat of cats) {
            if (!cat.onlick)
                cat.onclick = function (e) {
                    e.preventDefault();
                    Ajaxs.getProducts(cat.dataset.cat);
                };
        }
    },
    addProductosClicks: function () {
        var prods = document.getElementsByClassName("addProduct");
        for (let prod of prods) {
            if (!prod.onlick)
                (function (enlace) {
                    enlace.onclick = function (e) {
                        e.preventDefault();
                        Comandero.insertaProductoPedido({
                            "linea": Comandero.Pedido.length + 1,
                            "producto": enlace.dataset.nombre + " " + enlace.dataset.ud,
                            "precio": enlace.dataset.precio,
                            "cantidad": 1,
                            "elecciones": []
                        });
                    }
                })(prod);

        }
    },
    addMenusClicks: function () {
        var prods = document.getElementsByClassName("addProduct");
        for (let prod of prods) {
            if (!prod.onlick)
                (function (enlace) {
                    enlace.onclick = function (e) {
                        e.preventDefault();
                        Comandero.insertaProductoPedido({
                            "linea": Comandero.Pedido.length,
                            "producto": "Menú " + enlace.dataset.nombre,
                            "precio": enlace.dataset.precio,
                            "cantidad": 1,
                            "elecciones": WebFunctions.getSelectedElecciones("form-" + enlace.dataset.id)
                        });
                    }
                })(prod);
        }
    },
    getSelectedElecciones: function (form) {
        var selectedOptions = [];
        var selects = document.getElementById(form).getElementsByTagName("select");
        if (selects.length > 0) {
            for (let select of selects) {
                selectedOptions.push(select.options[select.selectedIndex].text);
            }
        }
        return selectedOptions;
    },
    addPlusAndMinusClicks: function () {
        var mores = document.getElementsByName("oneMore");
        for (let moreSpan of mores) {
            if (!moreSpan.onlick)
                (function (span) {
                    span.onclick = function (e) {
                        e.preventDefault();
                        Comandero.unoMasDe(span.dataset.lid);
                    }
                })(moreSpan);
        }

        var lesses = document.getElementsByName("oneLess");
        for (let lessSpan of lesses) {
            if (!lessSpan.onlick)
                (function (span) {
                    span.onclick = function (e) {
                        e.preventDefault();
                        Comandero.unoMenosDe(span.dataset.lid);
                    }
                })(lessSpan);
        }
    }
};

Ajaxs = {
    baseUrl: "http://127.0.0.1:3500",
    getCategorias: function () {
        $.ajax({
            "url": this.baseUrl + '/categorias',
            "type": "get",
            "dataType": "json",
        }).done(function (data) {
            for (var cat in data) {
                document.getElementById("catlist").innerHTML = document.getElementById("catlist").innerHTML + Plantillas.listItemCategoria(data[cat]);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            return null;
        }).always(function () {
            WebFunctions.addCategoriasClicks();
        });
    },
    getProducts: function (catname) {
        if (catname != "menus") {
            $.ajax({
                "url": 'http://127.0.0.1:3500/productos/categoria/' + catname,
                "type": "get",
                "dataType": "json",
            }).done(function (data) {
                document.getElementById("prodlist").innerHTML = "";
                for (var prod in data) {
                    document.getElementById("prodlist").innerHTML = document.getElementById("prodlist").innerHTML + Plantillas.cardProducto(data[prod]);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                return null;
            }).always(function () {
                WebFunctions.addProductosClicks();
            });
        } else {
            $.ajax({
                "url": 'http://127.0.0.1:3500/menus/',
                "type": "get",
                "dataType": "json",
            }).done(function (data) {
                document.getElementById("prodlist").innerHTML = "";
                for (var menu in data) {
                    document.getElementById("prodlist").innerHTML = document.getElementById("prodlist").innerHTML + Plantillas.cardMenu(data[menu]);
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                return null;
            }).always(function () {
                WebFunctions.addMenusClicks();
            });
        }
    },
    guardaPedido: function () {
        console.log(JSON.stringify(Comandero.Pedido));
        $.ajax({
            "url": this.baseUrl + '/pedidos',
            "type": "post",
            "dataType": "json",
            "data": {"pedido":Comandero.Pedido},
        }).done(function (data) {
             Comandero.reset();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            return null;
        });

    }
}

function resize() {
    var vHeight = $(window).height() - 100;
    var principal = $('.principal');
    principal.css({
        "min-height": vHeight
    });
}

function init() {
    window.onresize = resize;
    resize();
    document.getElementById("orderButton").onclick = function (e) {
        e.preventDefault();
        Ajaxs.guardaPedido();
    };
    //Dibujamos categorías
    Ajaxs.getCategorias();
}

window.onload = init;