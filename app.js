const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const { sequelize } = require('./models')

dotenv.config();

const passportConfig = require('./passport');

const pageRouter = require('./routes/page')
const authRouter = require('./routes/auth')

const app = express();


passportConfig(); // 패스포트 설정

app.set('port', process.env.PORT || 8002); // 서버에 속성 심기, 앱 전체에서 app.listen(app.get('port'), () => { console.log('익스프레스 서버실행')} 이렇게 사용 가능
app.set('view engine', 'html');
nunjucks.configure('views', {
  express : app,
  watch : true,
});

// 개발시 테이블을 잘못 만든 경우 {force : true}를 설정해두면 테이블이 다 지워지고 새로 생길 수 있음
sequelize.sync()
    .then(() => {
      console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
      console.error(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave : false, // 요청이 왔을 때 세션 수정사항이 생기지 않아도 다시 저장할지 여부
  saveUninitialized : false, // 세션에 저장할 내역이 없더라도 세션을 저장할지
  secret : process.env.COOLIE_SECRET, // 쿠키 암호화
  cookie : { // 세션 쿠키 옵션
    httpOnly : true,
    secure : false,
  },
}))

app.use(passport.initialize()); // passport 미들웨어 > 반드시 express session 밑에 위치해야 한다.
app.use(passport.session()); // 로그인이 성공하면 세션으로 user.id가 저장된다.
// connect.id라는 이름으로 세션 쿠키가 브라우저로 전송

app.use('/', pageRouter);
app.use('/auth', authRouter);

// 에러 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
})

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(app.get('port'), () => {
//   console.log(app.get('port'), '번 포트에서 대기중');
// })
app.listen(8002, function() {
  console.log('example app')
})





























