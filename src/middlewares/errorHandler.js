//Funciona cuando la funcion devulve un next con un error.
const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    
    res.status(err.status || 500).json({
      message: err.message || 'Error interno del servidor',
    });

  };
  
  module.exports = errorHandler;