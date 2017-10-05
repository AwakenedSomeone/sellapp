var express = require('express')
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();

router.get('', function (req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);
// 读取json数据
var appDate = require('./data.json');
var seller=appDate.seller;
var goods=appDate.goods;
var ratings=appDate.ratings;
// 编写路由
var apiRouts=express.Router();
apiRouts.get('/seller',function(req,res){
  res.json({
    errno:0,// 标识数据正常的情况
    data:seller// 具体数据
  });
});
apiRouts.get('/goods',function(req,res){
  res.json({
    errno:0,// 标识数据正常的情况
    data:goods// 具体数据
  });
});

apiRouts.get('/ratings',function(req,res){
  res.json({
    errno:0,// 标识数据正常的情况
    data:ratings// 具体数据
  });
});
//调用express的对象app
app.use('/api',apiRouts);

app.use(express.static('./dist'));

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})



var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
 }