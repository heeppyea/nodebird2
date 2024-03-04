const express = require('express');
const router = express.Router();
const { renderJoin, renderMain, renderProfile } = require('../controllers/page')
const { isLoggedIn, isNotLoggedIn} = require('../middlewares')

router.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
  // router에서 공통적으로 사용할 수 있는 변수가 res.locals이다. => 미들웨어 간 공유되는 대ㅔ이터
  // req.session은 사용자 간 공유되는 데이터? 사용자의 움직임을 추적하고 싶으면 req.session.data 이런 식으로 사용할 수 있음
})

// router의 마지막 미들웨어는 컨트롤러라고 한다.
router.get('/profile', isLoggedIn,  renderProfile); // 프로필
router.get('/join', isNotLoggedIn, renderJoin); // 회원가입
router.get('/', renderMain);

module.exports = router;
