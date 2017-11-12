var bodyParser= require('body-parser');
var morgan= require('morgan');
var mongoose= require('mongoose');
var express= require('express');
var app = express();
var apiRoutes = express.Router();

var config= require('./config');
var verifyUser= require('./app/verifyUser');
var User= require('./app/models/user');
var authenticate= require('./app/authenticate');

var port= process.env.PORT || 3000;
mongoose.connect(config.database);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', verifyUser, function(req, res) {
	// body...
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.use('/api', authenticate);


app.get('/setup', function(req, res){
	var lateef= new User({
		name: 'test', 
	    password: 'test', 
	    role: 'test'
	});

	lateef.save(function(err){
		if(err)
			throw err;
		res.json({success: 'true'});
	});

});

app.get('/api/getUsers', verifyUser, function(req, res){
	User.find({},{name: 1, _id: 1, role: 1}, function(err, data){
		if(err)
			throw err

		res.json(data);
	});
});



app.listen(port);

console.log('App is listening at localhost:'+ port);