const passport = require('passport');

exports.getIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
};

exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/upload',
    failureRedirect: '/'
  })(req, res, next);
};
