var express = require('express');
var router = express.Router();
var DB = require('../lib/db.js');

router.get('/', function(req, res) {
  let emitter = DB.getTodo();
  
  emitter.on("ok", function (data) {
    let d = JSON.parse(JSON.stringify(data));
    res.render('home',{todos: d});
  });
});

router.get('/edit/:id', function(req, res) {
  let id = req.params.id;

  let emitter = DB.getTodo();
  
  emitter.on("ok", function (data) {
    let d = JSON.parse(JSON.stringify(data));
    res.render('edit',{editId: id, todos: data});
  });
});

router.post('/create', function(req, res) {
  let data = {content:req.body.content};
  let emitter = DB.createTodo(data);
  
  emitter.on("ok", function (data) {
    res.redirect( '/todo' );
  });

  emitter.on("err", function(err){
    console.log(err);
    res.json({stauts: 403, data: err});
  })
  
});


router.post('/update/:id', function(req, res) {
  let data = {content:req.body.content};
  let cond = {_id:req.params.id};
  let emitter = DB.updateTodo(data, cond);
  
  emitter.on("ok", function (data) {
    res.redirect( '/todo' );
  });

  emitter.on("err", function(err){
    console.log(err);
    res.json({stauts: 403, data: err});
  })
  
});

router.get('/delete/:id', function(req, res) {
  let cond = {_id:req.params.id};
  let emitter = DB.deleteTodo(cond);
  
  emitter.on("ok", function (data) {
    res.redirect( '/todo' );
  });

  emitter.on("err", function(err){
    console.log(err);
    res.json({stauts: 403, data: err});
  })
  
});


module.exports = router;
