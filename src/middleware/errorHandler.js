const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: 'erro',
      mensagem: err.message || 'Erro interno do servidor',
    });
  };
  
  module.exports = errorHandler;