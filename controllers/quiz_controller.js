var models = require('../models/models.js');

// Autoload :id
exports.load = function(req, res, next, quizId) {
   models.Quiz.findById(quizId).then(
      function(quiz) {
         if (quiz) {
            req.quiz = quiz;
            next();
         } 
         else {
	    next(new Error('No existe quizId=' + quizId));
         }
      }
   ).catch(function(error) { next(error)});
};


// GET /quizes/
exports.index = function(req, res, next) {
   var busqueda = req.query.search;
   // Por defecto se muestran todas las preguntas al dar a preguntas
   // Se ordena por orden ascendente (ASC)
   // Nota: las minúsculas van después que las mayúsculas; así bbb irá después de CCC
   if (!!busqueda) {
	busqueda = '%' + busqueda + '%'; //Añade al principio y al final los %
	busqueda = busqueda.toLowerCase().trim();
	//busqueda = busqueda.replace(' ','%');
	busqueda = busqueda.replace(/\s/g,'%'); //reemplaza los espacios por %
   }
   models.Quiz.findAll((busqueda) ? {where: ["lower(pregunta) like ?", busqueda], order:"pregunta ASC"} : {order:"pregunta ASC"}).then(
	function(quizes) {
	    res.render('quizes/index.ejs', { quizes: quizes});
        }
   ).catch(function(error){next(error)});
};

// Otra forma
//      if (!!busqueda) {
//	 busqueda = '%' + busqueda + '%';
//	 busqueda = busqueda.toLowerCase().trim();
//	 busqueda = busqueda.replace(/\s/g,'%');
//	 models.Quiz.findAll({where: ["lower(pregunta) like ?", busqueda], order:"pregunta ASC"}).then(
//	     function(quizes) {
// 		res.render('quizes/index.ejs', { quizes: quizes});
//             }
//   	 ).catch(function(error) { next(error);});
//      }
//      else {
//	  models.Quiz.findAll({order:"pregunta ASC"}).then(
//	     function(quizes) {
//	       res.render('quizes/index.ejs', { quizes: quizes});
//           }
//        ).catch(function(error) { next(error);});
//     }
//};


// GET /quizes/:id
exports.show = function(req, res) {
    	res.render('quizes/show', { quiz: req.quiz});
};


// GET /quizes/:id/answer
exports.answer = function(req, res) {
      var resultado = 'Incorrecto';
      // En la respuesta se admite mayúsculas/minúsculas indistintamente
      // Se eliminan espacios inicial y final si hubiera
      // Se han de introducir los acentos correctos! (idioma español)
      // req.query.respuesta es la respuesta introducida desde el formulario
      // req.quiz.respuesta es la respuesta en la BD
      var patt = new RegExp('^' + req.quiz.respuesta + '$', 'i');
      if (patt.exec(req.query.respuesta.trim())) {
          resultado = 'Correcto'; 
      }
      res.render('quizes/answer',
		 {quiz: req.quiz, respuesta: resultado}
      );
};


// Controladores new y create para crear preguntas

// GET /quizes/new
exports.new = function(req, res) {
   // Creamos un objeto nuevo que luego modificamos
   var quiz = models.Quiz.build(
      {pregunta: "Pregunta", respuesta: "Respuesta"}
   );
   res.render('quizes/new', {quiz: quiz});
};


// POST /quizes/create
exports.create = function(req, res) {
   // Creamos un objeto nuevo con los datos del formulario
   var quiz = models.Quiz.build( req.body.quiz );
// guardar en DB los campos pregunta y respuesta de quiz
   quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
      res.redirect('/quizes');  
   })   // res.redirect: Redirección HTTP (URL relativo) a lista de preguntas
};
