const passport = require('passport');

const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;
  try {
    const exUser = await User.findOne({where : {email}});
    if(exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password : hash,
    })
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    next(error);
  }
}

exports.login = async (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if(authError) {
      console.error(authError);
      return next(authError);
    } // 서버 실패
    if(!user) {
      return res.redirect(`/?loginError=${info.message}`);
    } // 로직 실패
    return req.login(user, (loginError) => {
      if(loginError) {
        console.log(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    }) // 인증이 성공했다면 req.login으로 세션에 유저 정보 저장

  })(req, res, next); // 미들웨어 확장 패턴
}