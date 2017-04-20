$(document).ready(function(){
   	getDatos();
   	listCarrito();
   	$(".filter").keyup(function(){listCarrito()});
	$('.filter').focus();
	if (typeof(Storage) !== "undefined") {
		if (sessionStorage.carrito) {
			var carrito = JSON.parse(sessionStorage.carrito);
			if(carrito[0].cantidad == 0){
				sessionStorage.removeItem('carrito');
				$('#cantProducts').html('');
				$('#cantProducts2').html('');
			}else{
				$('#cantProducts').html(carrito[0].cantidad);
				$('#cantProducts2').html(carrito[0].cantidad);
			}
		}
	}
	$('#realizarCompra').click(function() {
		sessionStorage.removeItem('carrito');
		$('#cantProducts').html('');
		$('#cantProducts2').html('');
		listCarrito();
	});
});

var datos = {};
function getDatos() {
	$.ajax({
		url: '../../json/dataParcial.json',
		type: 'GET',
		async : false,
		dataTipe: 'JSON',
		success: function (data) { datos = data; },
	    error: function(objXMLHttpRequest) { console.log("error",objXMLHttpRequest); }
	});
}

function listCarrito() {
	var find = ($('.filter').val()).toUpperCase();
	var content = '<table class="table table-bordered">';
	content+='<tr><th>Nombre</th><th>Cantidad</th><th>Aumentar Cantidad</th><th>Reducir Cantidad</th><th>Sacar del carrito</th></tr>';
	var data = "";
	if (typeof(Storage) !== "undefined") {
		if (sessionStorage.carrito) {
			var carrito = JSON.parse(sessionStorage.carrito);
			for (var i = 1; i < carrito.length; i++) {
				var product = findElement(datos.products, 'id', carrito[i].id);
				var pro = (product.name).toUpperCase();
				if(find == "" || pro.indexOf(find)!=-1){
					data+='<tr>';
					data+='<td>'+product.name+'</td>';
					data+='<td>'+carrito[i].cantidad+'</td>';
					data+='<td><button class="btn btn-default" type="button" data-toggle="modal" data-target="#modalEdit" onclick="Aumentar('+carrito[i].id+')"><span class="glyphicon glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button></td>';
					data+='<td><button class="btn btn-default" type="button" data-toggle="modal" data-target="#modalEdit" onclick="reducir('+carrito[i].id+')"><span class="glyphicon glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button></td>';
					data+='<td><button class="btn btn-default" type="button" data-toggle="modal" data-target="#modalDelete" onclick="sacar('+carrito[i].id+')"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></td>';
					data+='</tr>';
				}
			};
		}
	}
	if(data == "") $('#msfind').html("No se encontraron Productos");
	else $('#msfind').html("");
	content += data+'</table>';
	$('#lista').html(content);
}

function findElement(obj, attrib, idCompare) {
	for (var i = 0; i < obj.length; i++){ var element = obj[i]; if(idCompare == element[attrib]) return element;} return null;
}

function sacar(idProduct) {
	var carrito = JSON.parse(sessionStorage.carrito);
		carrito.forEach(function(result, index) {
		    if(result['id'] === idProduct) {
		    	carrito[0].cantidad -= carrito[index].cantidad;
		      	carrito.splice(index, 1);
		    }    
		});
	if(carrito[0].cantidad == 0){
		sessionStorage.removeItem('carrito');
		$('#cantProducts').html('');
		$('#cantProducts2').html('');
	}else{
		$('#cantProducts').html(carrito[0].cantidad);
		$('#cantProducts2').html(carrito[0].cantidad);
	}
	sessionStorage.carrito = JSON.stringify(carrito);
	listCarrito();
}

function Aumentar(idProduct) {
	var carrito = JSON.parse(sessionStorage.carrito);
		carrito.forEach(function(result, index) {
		    if(result['id'] === idProduct) {
		    	carrito[index].cantidad += 1;
		    	carrito[0].cantidad += 1;
		    }    
		});
	if(carrito[0].cantidad == 0){
		sessionStorage.removeItem('carrito');
		$('#cantProducts').html('');
		$('#cantProducts2').html('');
	}else{
		$('#cantProducts').html(carrito[0].cantidad);
		$('#cantProducts2').html(carrito[0].cantidad);
	}
	sessionStorage.carrito = JSON.stringify(carrito);
	listCarrito();
}

function reducir(idProduct) {
	var carrito = JSON.parse(sessionStorage.carrito);
		carrito.forEach(function(result, index) {
		    if(result['id'] === idProduct) {
		    	carrito[index].cantidad -= 1;
		    	carrito[0].cantidad -= 1;
		    	if(carrito[index].cantidad==0){
		    		carrito.splice(index, 1);
		    	}
		    }    
		});
	if(carrito[0].cantidad == 0){
		sessionStorage.removeItem('carrito');
		$('#cantProducts').html('');
		$('#cantProducts2').html('');
	}else{
		$('#cantProducts').html(carrito[0].cantidad);
		$('#cantProducts2').html(carrito[0].cantidad);
	}
	sessionStorage.carrito = JSON.stringify(carrito);
	listCarrito();
}