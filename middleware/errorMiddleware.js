// middleware/errorMiddleware.js
module.exports = {
    handleErrors: (err, req, res, next) => {
      console.error('Error:', err);
  
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
      });
    },
  };
  