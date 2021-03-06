var express = require('express')
var path = require('path')
var compression = require('compression');
var proxy = require('proxy-middleware');
const webpack = require("webpack")
const webpackHotMiddleware = require("webpack-hot-middleware")
const webpackConfig = require('./webpack.config.js')

var app = express();

app.use(compression());

var compiler = webpack(webpackConfig);

app.use(require("webpack-dev-middleware")(compiler, {
	publicPath: webpackConfig.output.publicPath,
	quiet: true //向控制台显示任何内容
}));

app.use(webpackHotMiddleware(compiler,{
	log: false,
	heartbeat: 2000,
}));
// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'build')))

// send all requests to index.html so browserHistory works
app.use('/emaCat', proxy('http://192.168.11.2:8080'));
// app.use('/emaCat', proxy('http://114.55.250.173:8080/emaCat'));
// app.use('/emaCat', proxy('http://192.168.21.31:8080'));
// app.use('/emaCat', proxy('http://192.168.20.157:8080/emaCat'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

var PORT = process.env.PORT || 9002

app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT)
})
