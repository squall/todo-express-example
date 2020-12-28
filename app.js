var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var http = require('http');
var port = process.env.PORT || 8888;
var app = express();
var DB = require("./lib/db.js");

//設定路由
var todoRouter = require('./routes/todo');

var init_web = function () {
    http.createServer(app).listen(port, function () {
        console.log("Express server listening on port " + port);
    });
};

var init_db_emitter = DB.init();

init_db_emitter.on("ok", function () {
    init_web();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res, next) {
    res.redirect('/todo');
});
  
app.engine('.hbs', exphbs({
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: require('./lib/handlebars-helpers')
}));

app.set('view engine', '.hbs');

app.use('/todo', todoRouter);

exports = module.exports = app;
