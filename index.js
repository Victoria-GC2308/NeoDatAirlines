const express = require("express"); //librería express

const mysql = require("mysql2"); //librería base de datos

const app = express(); //uso express app x convencion

const conexion = mysql.createConnection({   //conexión a base de datos
    host: "localhost",
    database: "neo_datairlines",
    user: "root",
    password: ""   //ver temita password
})

app.set("view engine", "ejs");

// Antes de tus rutas (app.get, app.post, etc.)
const path = require('path');

// Esto permite que los archivos en las carpetas 'Style' e 'Images' sean accesibles 
// a través de la ruta raíz ( / ) en el navegador.
app.use(express.static(path.join(__dirname, 'Public')));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", function(rec, res){   //esto me dice que es la pág inicial (index.ejs)
    res.render("index");
})

app.listen(3000, function(){
    console.log("http://localhost:3000/");
})
