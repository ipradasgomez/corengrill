Plantillas = {
    itemPedidoSimple: function (pedido) {
        //Si tiene subElecciones
        var result = '<div class="ml-4"><ul class="orders mb-0 ">';        
       for(let linea of pedido.lineas_pedido){         
            result+='<li><b>'+linea.cantidad+' x </b>'+linea.producto+'</li>'
            if(linea.elecciones){
                result+="<ul>";
                for(let eleccion of linea.elecciones){ 
                    result+='<li>'+eleccion+'</li>'
                }
                result+="</ul><hr/>";
            }
        }
        result += "</ul></div>";
        return `
        <div class="card pedido `+pedido.estado.toLowerCase()+`" data-pid="`+pedido._id+`">
        <div class="card-body">
            <div class="d-flex justify-content-between">
                <div>
                    <b>` + pedido.estado + `</b>
                </div>
            </div>
            `+result+`
            </div></div>`;
    },
    representaPedidos: function () {
        var listaPedidos = document.getElementById("pedidos");
        listaPedidos.innerHTML = "";
        Cocina.Pedidos.forEach(linea => {
            listaPedidos.innerHTML = listaPedidos.innerHTML + Plantillas.itemPedidoSimple(linea);
        })
        WebFunctions.addPedidosClicks();
    },
};
Cocina = {
    Pedidos: [],
};


WebFunctions = {    
    addPedidosClicks: function () {
        var pedidos = document.getElementsByClassName("pedido");
        for (let pedido of pedidos) {
            if (!pedido.onlick)
            (function(enlacepedido){
                enlacepedido.onclick = function (e) {
                    e.preventDefault();
                    console.log(enlacepedido.dataset.pid);
                    Ajaxs.setEstado(enlacepedido.dataset.pid, "Finalizado");
                };
            })(pedido);
                
        }
        
    },
    
};

Ajaxs = {
    baseUrl: "http://127.0.0.1:3500",
    getPedidos: function () {
        $.ajax({
            "url": this.baseUrl + '/pedidos',
            "type": "get",
            "dataType": "json",
        }).done(function (data) {
            Cocina.Pedidos=data;
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Cocina.pedidos= [];
        }).always(function () {
            Plantillas.representaPedidos();
        });
    },
    
    setEstado: function (pid, estado) {
        $.ajax({
            "url": this.baseUrl + '/pedidos/'+pid,
            "type": "put",
            "dataType": "json",
            "data": {"estado":estado},
        }).done(function (data) {
             Ajaxs.getPedidos();
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
    //Obtenemos los productos
    Ajaxs.getPedidos();
}

window.onload = init;