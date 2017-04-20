$(document).ready(function(){
   	getDatos();
   	listCategories();
   	$(".filter").keyup(function(){listCategories()});
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

function listCategories() {
	var find = ($('.filter').val()).toUpperCase();
	var content = '<table class="table table-bordered">';
	content+='<tr><th>id</th><th>Nombre</th></tr>';
	var data = "";
	for (var i = 0; i < datos.categories.length; i++) {
		var categoria = (datos.categories[i].categori_id+datos.categories[i].name).toUpperCase();
		if(find == "" || categoria.indexOf(find)!=-1){
			data+='<tr>';
			data+='<td>'+datos.categories[i].categori_id+'</td>';
			data+='<td>'+datos.categories[i].name+'</td>';
			data+='</tr>';
		}
	};
	if(data == "") $('#msfind').html("No se encontraron Categorias");
	else $('#msfind').html("");
	content += data+'</table>';
	$('#lista').html(content);
}