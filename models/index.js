const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development'; // 환경 변수 설정
const config = require('../config/config.json')[env] // 설정, config 안에 config.json

const db = {}; // 빈 객체 생성

const sequelize = new Sequelize(config.database, config.username, config.password, config );
// config 설정을 불러와서 sequelize 연결을 만듬

db.sequelize = sequelize; // 계속 재사용하기 때문에 db로 묶어둠

const basename = path.basename(__filename); // index.js가 된다.

// 숨김파일, index.js, js 파일이 아니면 제외
fs.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
}).forEach((file) => {
  const model = require(path.join(__dirname, file));
  db[model.name] = model;
  model.initiate(sequelize)
});

// initiate를 전부다 하고, associate를 해야함
Object.keys(db).forEach(modelName => {
  if(db[modelName].associate) {
    db[modelName].associate(db);
  }
})

module.exports = db;
