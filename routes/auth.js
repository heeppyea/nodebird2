const express = require('express');
const passport = require('passport');
const { isNotLoggedIn } = require('../middlewares');
const { join , login } = require('../controllers/auth')
const router = express.Router();

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login )

// 회원가입과 로그인이 전략에서 동시에 수행
router.get('/kakao', passport.authenticate('kakao'));

// /kakao/callback 라우터에서는 인증 성공시 (res.redirect)와 실패시 failureRedirect 리다이렉트할 경로 지정
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
