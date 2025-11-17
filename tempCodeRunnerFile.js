const express = require("express"); //librería express

const mysql = require("mysql2"); //librería base de datos

const app = express(); //uso express app x convencion

const conexion = mysql.createConnection({   //conexión a base de datos
    host: "localhost",
    database: "neo_datairlines",
    user: "root",
    password: ""   // Con mysql, usar la contraseña de la bd, para phpmyadmin, password empty "".
});

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
app.get("/index_buscador", function(rec, res){   //esto me dice que es la pág inicial (index.ejs)
    res.render("index_buscador");
});
app.get("/index_about", function(rec, res){   //esto me dice que es la pág inicial (index.ejs)
    res.render("index_about");
});

//comenzar

app.post("/usuario_nuevo", function(rec, res) {
    const datos = rec.body;
    let nombre = datos.nombre;
    let dni = datos.dni;
    let email = datos.email;
    let telefono = datos.telefono;
    let password = datos.password;
    const insertar = `INSERT INTO usuario (nombre, dni, password, telefono, email) VALUES ("${nombre}", "${dni}", "${password}", "${telefono}", "${email}")`;
    //acá cambié el atributo correo_electronico por email, así lo tengo en mi base de datos (Victoria)
    conexion.query(insertar, function(error, rows) {
        if(error) {
            throw error;
        }
        else {
            console.log("Datos Insertados.");
        }
    });
})

app.post("/usuario", function(rec, res) {
    const datos = rec.body;
    let mail_registrado = datos.mail_registrado;
    let loginPassword = datos.password;
    const busqueda = `SELECT password, email FROM usuario WHERE "${loginPassword}" AND "${mail_registrado}"`;
    //acá idem línea 40 
    conexion.query(busqueda, function(error, rows) {
        if(error) {
            throw error;
        }
        else if(busqueda.length > 0) {
            console.log("Usuario encontrado.");
        }
    });
})
app.post("/index_buscador", function(req,res){
    const datos =req.body;
    let origen = datos.origen;
    let destino = datos.destino;
    let partida = datos.partida;
    let pasajero = datos.pasajero ||1; // porque la fecha de regreso es opcional 
    let consulta = `SELECT *FROM vuelo WHERE salida = ? AND destino = ? AND salida >=?`;
    let parametros = [origen, destino, partida];
    
    consulta += `ORDER BY salida ASC`;

    console.log("Ejecutando consulta:", consulta);
    console.log("Parámetros:", parametros);
    conexion.query(consulta, parametros, function(error, resultados){
        if(error){
            console.error("Error en la consulta", error);
            return res.render("index_buscador", {
                error: "Error en la búsqueda",
            vuelos: []});

        }
        console.log("resultadoes encontrados:", resultados.length);
        res.json({
            success: true,
            vuelos: resultados,
            cantidad: resultados.length,
            busquedaRealiada: true
        });
    });
});

app.listen(3000, function(){
    console.log("http://localhost:3000/");
})
