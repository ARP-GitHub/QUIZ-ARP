// GET /quizes/question
exports.question = function(req, res) {
   res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

// GET /quizes/answer
exports.answer = function(req, res) {
   // En la respuesta se admite mayúscula/minúscula indistintamente
   // Se eliminan espacios inicial y final si se introdujeran
   if (req.query.respuesta.trim().match(/^roma$/i)){
       res.render('quizes/answer', {respuesta: 'Correcto'});
   } else {
       res.render('quizes/answer', {respuesta: 'Incorrecto'});
   }
};
