var models = require('../models/models.js');

var estadistica = {
	preguntas: 0,
	comentarios: 0,
	comentarios_NoPubli: 0,
	preguntas_SinComentarios:0,
	preguntas_ConComentarios: 0
};

//var errors = [];


exports.calculate = function(req, res, next) {
        models.Quiz.count()  // Buscamos nº preguntas
        .then(function(numPregs) {  // se devuelven el nº de preguntas
	     estadistica.preguntas = numPregs;  // actualizamos (guardamos) nº de preguntas en estadisticas
	     return models.Comment.count(); // Buscamos nº de comentarios
	})
	.then(function(numComentarios) { // se devuelven el nº total de comentarios
	     estadistica.comentarios = numComentarios;  // actualizamos (guardamos) nº de comentarios en estadisticas
	     return models.Comment.countPregComentadas();  // Buscamos nº de preguntas con comentarios
	})
	.then(function(numPregComentadas){ // se devuelven el nº de preguntas con comentarios
	     estadistica.preguntas_ConComentarios = numPregComentadas; // guardamos nº de preguntas con comentarios en estadisticas
        })
	.then(function() {
             estadistica.preguntas_SinComentarios = estadistica.preguntas - estadistica.preguntas_ConComentarios;
	     return models.Comment.countComNoPublicado();  // Buscamos nº de comentarios no publicados
	})
	.then(function(numComNoPublicados){ // se devuelven el nº de comentarios no publicados
       	     estadistica.comentarios_NoPubli = numComNoPublicados; // guardamos nº de comentarios no publicados en estadisticas
	})
	.catch(function(err) {
		errors.push(err);
	})
	.finally(function(){
		next();
	});
};


 //   }).catch( function (err) {
  //      next(err);
 //   }).finally( function() {
 //      next();
  //  });
//};


// GET /quizes/statistics
exports.show = function(req, res) {
    res.render('quizes/statistics.ejs', { estadistica: estadistica, errors: []});
};