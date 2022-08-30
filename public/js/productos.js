console.log(`buenas son productos desde handlebars`);

let carrito = 0; //-1
let compra = 0;
let producto = 100;

function comprarProducto(){
    carrito++;
   return carrito;
}

function totalCompra(){
    compra = carrito*producto;
     return compra;
}

// onclick="coprarProducto()"

comprarProducto();
comprarProducto();
comprarProducto();
//comprarProducto();

totalCompra();
//totalCompra();

//let total = comprarProducto()
let total = carrito
let pago = totalCompra()

console.log('los productos son ' + carrito );
console.log('el total de la compra es ' + pago + '€');