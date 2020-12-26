var mongoose = require("mongoose"),
    events = require("events"),
    EventEmitter = events.EventEmitter,
    Schema = mongoose.Schema,
    MONGO_URI = (typeof process.env.MONGOLAB_URI == 'undefined') ? 'mongodb://localhost/todo' : process.env.MONGOLAB_URI,
    connectedDb;


var SCHEMAS = {
    todo: {
        'schema': new Schema({
            'uid': { type: String, trim: true },
            'content': { type: String },
            'init_date': { type: Date, default: Date.now }
        }),
        'collection': 'todo'
    }
}
var getModel = function getModel(model_name) {
    if(!SCHEMAS[model_name] || !connectedDb) {
      return null;
    }
    return connectedDb.model(model_name, SCHEMAS[model_name].schema, SCHEMAS[model_name].collection);
};

  
exports.init = function init() {
    mongoose.set('useUnifiedTopology', true);
    //mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    
    var db = mongoose.createConnection(MONGO_URI, { useNewUrlParser: true }),
        emitter = new EventEmitter();
    db.on("error", function (err) {
        console.error("DB: connection error " + err.message);
        emitter.emit('error', err);
    });

    db.on("open", function () {
        console.log("DB: connected successfully");
        connectedDb = db;
        emitter.emit("ok");
    });

    return emitter;
};



/* CRUD */

//Create
exports.createTodo = function (data) {
    let emitter = new EventEmitter();
    let todo = getModel("todo")

    todo.create(data, function (err, data) {
        if (err) {
            emitter.emit("err",err);
        } else {
            emitter.emit("ok", data);
        }
    });

    return emitter;

};

//Read
exports.getTodo = function (){
    let emitter = new EventEmitter();
    let todo = getModel("todo")

    todo.find({}, function (err, data) {
        if (err) {
            emitter.emit("err",err);
        } else {
            emitter.emit("ok", data);
        }
    });

    return emitter;
}

//Update
exports.updateTodo = function(data,cond){
    let emitter = new EventEmitter();
    let todo = getModel("todo");
    
    todo.updateOne(cond, { $set: data},function(err, data){
      if(err){
        emitter.emit("err");
      }else{
        emitter.emit("ok", data);
      }
    });
    return emitter;
  };

//Delete
exports.deleteTodo = function(cond){
    let emitter = new EventEmitter();
    let todo = getModel("todo");

  todo.deleteOne(cond, function(err, data){
    if(err){
      emitter.emit("err");
    }else{
      emitter.emit("ok");    
    } 
  });
  return emitter;
}