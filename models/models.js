﻿var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
			      {
				dialect: protocol, 
				protocol: protocol,
				port: port,
				host: host,
				storage: storage,
				omitNull: true
			      }
		);

// Importar definicion de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

// exportar definición de tabla Quiz
exports.Quiz = Quiz; 

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){     
       if(count === 0) {
	   // la tabla se inicializa solo si está vacía
	   // al meter más preguntas aquí (registros) hay que borrar la tabla (entorno local), y resetearla (en heroku)
            Quiz.bulkCreate( 
			[
			  {pregunta: 'Capital de España',  respuesta: 'Madrid', tema: 'Ciencia'},
			  {pregunta: 'Capital de Francia',  respuesta: 'París', tema: 'Ciencia'},
			  {pregunta: 'Capital de Italia',  respuesta: 'Roma', tema: 'Ciencia'},
			  {pregunta: 'Capital de Portugal',  respuesta: 'Lisboa', tema: 'Ciencia'},
 			  {pregunta: 'Capital de San Marino',  respuesta: 'San Marino', tema: 'Ciencia'}
			]
	    ).then(function(){console.log('Base de datos (tabla quiz) inicializada')});
       };
  });
});
    