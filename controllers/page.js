const User = require('../models/user');
const Post = require('../models/post')
exports.renderProfile = (req, res, next) => {
  res.render('profile', { title : '내 정보 - NodeBird'});
}

exports.renderJoin = (req, res, next) => {
  res.render('join', {title : '회원 가입 - NodeBird'});
};

exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include : {
        model : User,
        attributes : ['id','nick'],
      },
      order : [['createdAt', 'DESC']]
    })
    res.render('main', {
      title : 'NodeBird2',
      twits : [],
    })
  } catch (error) {
    console.error(error);
    next(error)
  }
}