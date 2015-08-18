var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// El módulo express-partials importa una factoría que debe invocarse con () para generar el MW a instalar
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({ extended: false }));
// Eliminamos parámetro configuración incluido por defecto con express.generator
// Así el MW bodyparser.unlencoded() analiza correctamente los nombres de los parámetros del formulario (_form.ejs) del objeto quiz
// y genera el objeto req.body.quiz
app.use(bodyParser.urlencoded());  // o bien ... urlencoded({extended: true }));

app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


//Helpers dinámicos
app.use(function(req,res,next){
  //Guardar path en session.redir para despueś de login
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir=req.path;
    console.log("-->> req.session.redir: " + req.session.redir); //
  }
  //Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


//Auto-logout de sesión
app.use( function (req, res, next){
  var ahora = new Date().getTime(); // Más lento que Date.now()
  // var ahora = Date.now(); // Date.now() no está soportado para IE<9, pero es mejor  
  req.session.tlogout = 120;   // 120 segundos
  //Comprueba periodo inactividad
  //Si existe la sesion de usuario y hay o ha habido actividad, (es decir no se ha hecho logout)
  if(req.session.anterior && req.session.user){
      //Si han pasado dos minutos
      var tinactivo = ahora - req.session.anterior;
      if( (tinactivo ) > req.session.tlogout*1000){
          //Al pasar 2 min (120 sg) de inactividad expira la sesión (la borramos)
	  // La inactividad se reinicia al hacer alguna acción (click en algún botón)
	  // Si solo se escribe, sigue corriendo el tiempo	
           delete req.session.user;
	   //req.session.anterior = null;
           res.redirect('/login'); 
	   console.log("Logout por inactividad de sesión: " + (tinactivo/1000) + " s; (máximo inactividad " + req.session.tlogout + " s)");
      }
  }
  req.session.anterior = ahora; 
  res.locals.session = req.session;
  next();
});


app.use('/', routes);

// undefined route, catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            	   	      message: err.message,
            	    	      error: err,
	    	    	      erros: []
            	   	    }
       );
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        		  message: err.message,
        		  error: {},
			  erros: []
    			}
    );
});


module.exports = app;
