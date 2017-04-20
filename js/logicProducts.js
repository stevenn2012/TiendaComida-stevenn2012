$(document).ready(function(){
   	getDatos();
   	loadCategories();
   	listProducts();
   	$(".filter").keyup(function(){listProducts()});
	$('.filter').focus();
	$('#bestButton').change(function(){listProducts()});
	$('#priceButton1').change(function(){listProducts()});
	$('#priceButton2').change(function(){listProducts()});
	$('#categoriesList').change(function(){listProducts()});
	$('#dispList').change(function(){listProducts()});
	$('#OrdenList').change(function(){listProducts()});
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

var ant = 0;
function listProducts() {
	var products = {};
	if($('#OrdenList').val() == 0 && ant != 0){
		getDatos();
		ant = 0;
	}
	products = datos.products;
	if($('#OrdenList').val() == 1){
		products = sortByKey(products, 'name', 1);
		ant = 1;
	}
	if($('#OrdenList').val() == 2){
		products = sortByKey(products, 'price', 2);
		ant = 2;
	}
	if($('#OrdenList').val() == 3){
		products = sortByKey(products, 'price', 3);
		ant = 3;
	}
	var find = ($('.filter').val()).toUpperCase();
	var data = "";
	for (var i = 0; i < products.length; i++) {
		var categoria = (products[i].id+products[i].name).toUpperCase();
		if(find == "" || categoria.indexOf(find)!=-1){
			if(($('#bestButton').prop('checked') == false) || ($('#bestButton').prop('checked') == true && products[i].best_seller==true)){
				if(($('#priceButton1').prop('checked') == false) || ($('#priceButton1').prop('checked') == true && products[i].price.replace('.','') >= 30000)){
					if(($('#priceButton2').prop('checked') == false) || ($('#priceButton2').prop('checked') == true && products[i].price.replace('.','') <= 10000)){
						var valCategorie = false;
						if($('#categoriesList').val() !=0){
							for (var j = 0; j < products[i].categories.length; j++) {
								if(products[i].categories[j] == $('#categoriesList').val()){
									valCategorie = true;
									break;
								}
							}
						}else valCategorie = true;
						if(valCategorie){
							if($('#dispList').val() == 0 || ($('#dispList').val() == String(products[i].available))){
								data+='<div class="row card1">';
								data+='<div>';
								data+='<div class="thumbnail">';
								data+='<img class="img-thumbnail" src="'+products[i].img+'" alt="...">';
								data+='<div class="caption">';
								if(products[i].available == false) data+='<span class="badge red">not available</span>';
								var name = '<h3>'+products[i].name;
								if(products[i].best_seller) name+=' <span class="badge blue">best seller</span>';
								data += name+'</h3>'
								data+='<p>'+products[i].description+'</p>';
								data+='<p> Precio: '+formatNumber.new(parseFloat(products[i].price.replace('.','')), "$")+'</p>';
								data+='<p>Categorias:<span>';
								for (var j = 0; j < products[i].categories.length; j++) {
									data+=' <span class="badge yellow">'+findElement(datos.categories, 'categori_id', products[i].categories[j]).name+'</span><span>&nbsp</span>';
								}
								data+='</span></p>';
								data+='<span>&nbsp</span><button onclick="agregarCarrito('+products[i].id+')" class="btn btn-default" role="button"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span></button></p>';
								data+='</div></div></div></div>';
							}
						}
					}
				}
			}
		}
	};
	if(data == "") $('#msfind').html("No se encontraron productos");
	else $('#msfind').html("");
	$('#lista').html(data);
}

function sortByKey(array, key, type) {
    return array.sort(function(a, b) {
    	if(type == 1){
    		console.log('1');
    		var x = a[key].toUpperCase(); var y = b[key].toUpperCase();
        	return ((x < y) ? -1 : ((x > y) ? 1 : 0));	
    	}else if(type == 2){
    		var x = parseInt(a[key].replace('.','')); var y = parseInt(b[key].replace('.',''));
        	console.log('2: x = '+x+' > y = '+y+', '+(x > y));
        	return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    	}else if(type == 3){
    		var x = parseInt(a[key].replace('.','')); var y = parseInt(b[key].replace('.',''));
    		console.log('3: x = '+x+' < y = '+y+', '+(x < y));
        	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    	}
    });
}


function loadCategories() {
	var data = '<option value="0">Todas</option>';
	for (var i = 0; i < datos.categories.length; i++) {
		data += '<option value="'+datos.categories[i].categori_id+'">'+datos.categories[i].name+'</option>';
	};
	$('#categoriesList').html(data);
}

function agregarCarrito(idProducto) {
	if (typeof(Storage) !== "undefined") {
		if (sessionStorage.carrito) {
			var carrito = JSON.parse(sessionStorage.carrito);
			var create = true;
			for (var i = 1; i < carrito.length; i++) {
				if(carrito[i].id == idProducto){
					carrito[i].cantidad += 1;
					create = false
					break;
				}
			}
			if(create) carrito.push({'id': idProducto, 'cantidad' : 1});	
			carrito[0].cantidad += 1;
			$('#cantProducts').html(carrito[0].cantidad);
			$('#cantProducts2').html(carrito[0].cantidad);
		    sessionStorage.carrito = JSON.stringify(carrito);
		} else {
			var carrito = [{'cantidad':1}, {'id': idProducto, 'cantidad' : 1}];
			$('#cantProducts').html(carrito[0].cantidad);
			$('#cantProducts2').html(carrito[0].cantidad);
		    sessionStorage.carrito = JSON.stringify(carrito);
		}
	} else {
	    console.log("Sorry, your browser does not support Web Storage.");
	}
}

var formatNumber = {
	separador: ".", // separador para los miles
	sepDecimal: ',', // separador para los decimales
	formatear:function (num){
		num +='';
	  	var splitStr = num.split('.');
	  	var splitLeft = splitStr[0];
	  	var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
	  	var regx = /(\d+)(\d{3})/;
	  	while (regx.test(splitLeft)) {
	  		splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
	  	}
	  	return this.simbol + splitLeft  +splitRight;
	},
	new:function(num, simbol){
	  	this.simbol = simbol ||'';
	  	return this.formatear(num);
	}
}

function findElement(obj, attrib, idCompare) {
	for (var i = 0; i < obj.length; i++){ var element = obj[i]; if(idCompare == element[attrib]) return element;} return null;
}