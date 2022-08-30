const express = require('express');
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 8080;

//conexion a la base de datos  con mysql2 

const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,   
    database: process.env.DATABASE
});

conexion.connect((err) => {
    if(err) {
        console.error('error al conectar: ' + err.stack);
        return;
    }
    console.log(`Conectado a la base de datos ${process.env.DATABASE}`);
});  

 conexion.connect();

//configuracion middleware

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

//configuracion de hbs motor de plantillas

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));  //para que busque en la carpeta views   //__dirname es el directorio actual donde esta el archivo index.js
hbs.registerPartials(path.join(__dirname,'views/partials'));
    
//rutas-----------------------------------------------

app.get('/',(req,res, next)=>{
    res.render('index',{
        title:'nose',
        style:'index.css'

    });
});

app.get('/ayuda',(req,res, next)=>{
    res.render('ayuda', {
        title:'Ayuda',
        style:'ayuda.css'
    });
});


app.get('/login',(req,res)=>{
    res.render('login', { 
       title:'login',
});
});

 app.get('/formulario',(req,res)=>{
             res.render('formulario', { 
                title:'Formulario',
      });
        });

        app.post('/formulario',(req,res)=>{
          const {nombre, precio} = req.body;	//destructuracion de objetos
             console.log(nombre, precio);
        
            if (nombre == '' || precio == '') {
               let validacion = 'Rellene todos los campos';
        //falta el titulo
                 res.render('formulario', { validacion
            });
            } else {
        
                let datos = {
                    nombre: nombre,
                    precio: precio
                }
        
                let sql = 'INSERT INTO productos SET ?';
        
                conexion.query(sql, datos, (err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
                    if(err) throw err;                        //si hay error, se detiene la ejecucion y se muestra el error
                    res.render('formulario', {                      //si no hay error, se muestra el resultado de la consulta
                        title:'Formulario',                       //se muestra el resultado de la consulta
                        validacion: 'Producto añadido correctamente' //se muestra el resultado de la consulta  
                    });
                }   );

            }

        });


app.get('/productos',(req,res, next)=>{

            let sql = 'SELECT * FROM productos';
       
           conexion.query(sql,(err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
                if(err) throw err;                       //si hay error, se detiene la ejecucion y se muestra el error
                   res.render('productos', {                      //si no hay error, se renderiza la pagina productos con los datos de la base de datos
                       results: result, //se muestra el resultado de la consulta  
                   });
               });
       });






app.get('/contacto',(req,res)=>{
            res.render('contacto',{
                title:'Contacto'
            });
        }   );
        
app.post('/contacto',(req,res)=>{
            const {nombre, email, telefono, cuerpo} = req.body;
            let fecha = new Date().getDate();
           
            if (nombre == '' || email == ''|| telefono == '' || cuerpo == '') {
                let validacion = 'Rellene todos los campos correctamente';
         //falta el titulo
                  res.render('contacto', { validacion}
             );
             } else {  
                let datos = {
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    cuerpo: cuerpo

                }
        
                let sql = 'INSERT INTO contactos SET ?';
        
                conexion.query(sql, datos, (err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
                    if(err) throw err;                        //si hay error, se detiene la ejecucion y se muestra el error
                    res.render('index', {                      //si no hay error, se muestra el resultado de la consulta
                                              //se muestra el resultado de la consulta
                        validacion: 'Nos contactaremos a la brevedad' //se muestra el resultado de la consulta  
                    });
                }   );


              } 
                });
        
app.get('/contacto2',(req,res)=>{
            res.render('contacto',{
                title:'Contacto'
            });
        }   );
        
app.post('/contacto2',(req,res)=>{
            const {nombre, email} = req.body;
            let fecha = new Date().getDate();
           
            if (nombre == '' || email == '') {
                let validacion = 'Rellene todos los campos correctamente';
         //falta el titulo
                  res.render('contacto', { validacion}
             );
             } else {
                console.log(nombre, email);
        
            async function envioEmail() { 
        
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.USER_EMAIL,
                        pass: process.env.PASSWORD_EMAIL
                    }
                });
        
                let envio = await transporter.sendMail({
                    from: process.env.USER_EMAIL,
                    to: `${email}`,
                    subject: 'Gracias por contactarnos',
                    html: `<h1>Gracias ${nombre} por contactarnos </h1> <br> 
                    <p>Te responderemos a la brevedad</p> <br> ${fecha}   `
            });
                //res.send(`Tus datos recibidos son : Nombre: ${nombre} y email: ${email}`);
        
            res.render( 'enviado', {
                title:'Mail Enviado',
                nombre,
                email
            })
            }
            envioEmail();
        
            let datos = {                           //CONEXION A LA BASE DE DATOS
                nombre: nombre,
                email: email
            }
        
            let sql = 'INSERT INTO contactos SET ?';
        
            conexion.query(sql, datos, (err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
                if(err) throw err;                        //si hay error, se detiene la ejecucion y se muestra el error
                /* res.render('contacto', {                      //si no hay error, se muestra el resultado de la consulta
                    title:'Contacto',                       //se muestra el resultado de la consulta
                    validacion: 'Datos guardados' //se muestra el resultado de la consulta  
                }); */
            }   );
        
               }
           });            

app.get('/contactos',(req,res, next)=>{

            let sql = 'SELECT * FROM contactos';
       
           conexion.query(sql,(err, result) => {  //query es una funcion de mysql que hace una consulta a la base de datos
                if(err) throw err;                       //si hay error, se detiene la ejecucion y se muestra el error
                   res.render('contactos', {                      //si no hay error, se renderiza la pagina productos con los datos de la base de datos
                       results: result, //se muestra el resultado de la consulta  
                   });
               });
       });




app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    }   );