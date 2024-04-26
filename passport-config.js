const LocalStrategy = require('passport-local').Strategy;

const users = [
  { id: '1', username: 'Binary', password: 'binary123' },
  { id: '2', username: 'User2', password: 'password2' }
];

module.exports = function(passport) {
  passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
  });
};
