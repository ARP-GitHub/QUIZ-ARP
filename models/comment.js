//definición del modelo Comment con validación

module.exports = function (sequelize, DataTypes) {
	return sequelize.define(
		'Comment',
			  {
			     texto: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta Comentario"}}
		  	     },
		  	     publicado: {
		  		type: DataTypes.BOOLEAN,
		  		defaultValue: false
		  	     }
			  },
			  {
			     classMethods: {
				count: function(){
					return this.aggregate('QuizId', 'count', { distinct: false })
				},
				countPregComentadas: function(){
					return this.aggregate('QuizId', 'count', { distinct: true })
				},
				countComNoPublicado: function() {
					return this.aggregate('QuizId', 'count', { where: { publicado: false }});
				}
			     }
		          }
	);
};