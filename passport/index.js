const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // 로그인이 성공했을 때 실행되는 함수
  // user.id만 추출해서, 사용자 아이디만 저장
  // { 세션쿠키 : 유저 id} 형태로 메모리에 저장된다.

  passport.deserializeUser((id, done) => {
    User.findOne({where : {id}})
        .then(user => done(null, user))
        .catch(err => done(err));
  });

  local();
  kakao();
}