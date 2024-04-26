// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); 
      res.redirect('/');
    }
     
  };
  

  module.exports =   isAuthenticated 