const passport = require('passport');
const User = require('../models/user');
const { Strategy : LocalStrategy } = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = () => {
  passport.use(new LocalStrategy({ // passport에 localStrategy 등록
    usernameField : 'email', // req.body.email
    passwordField : 'password', // req.body.password
    passReqToCallback : false,
  }, async (email, password, done) => { // done(authError, user, info)
    try {
      const exUser = await User.findOne({where : {email}}); // 기존 유저
      if(exUser) {
        const result = await bcrypt.compare(password, exUser.password)
        if(result) {
          done(null, exUser);
          console.log(exUser,'user존재')
        } else {
          done(null, false, { message : '비밀번호가 일치하지 않습니다.'})
        }
      } else {
        done(null, false, {message : '가입되지 않은 회원입니다.'});
      }
    }  catch (error) {
      console.error(error);
      done(error);
    }
  }))
};
