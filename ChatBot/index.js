var express = require('express');
var app = express();
var fs = require('fs');
var url = require('url');
var ejs = require('ejs');
var logs;
var server = require('http').createServer(app);
var io= require('socket.io').listen(server);
var userId;

myConnections=[];
users =[];
// database
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodeAssignment'
});
// opening a connection to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log('You are now connected...');
  // query
 
   });
//  socket connections

io.sockets.on('connection', function(socket){
	myConnections.push(socket)
	console.log('connnected sockets: % sockets', myConnections.length);

	socket.on('disconnect',function(data){
	myConnections.splice(myConnections.indexOf(data),1)
	});
	// on new message
	
	socket.on('send message',function(data){	
    connection.query('INSERT INTO chat(usrname,chat) VALUES(?,?)',[userId,data[0]],function(err,result){
			if(err) console.log(err);
			
		});
	
		var data_= [];
		data_[0]=data[0];
		data_[1]=data[1];
	io.sockets.emit('new message',{msg: data_});	

	});
	});
// database



// main entry==================================================
app.get('/',function(req,response){


fs.readFile("index.html", 
  
  function(err, data){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(data);
  response.end();
  });
});
//=====================================================================

//RequestMapping of Registering a user=================================
app.get('/Register',function(req,response){

fs.readFile("Register.html", 
  
  function(err, data){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(data);
  response.end();
  });

 
});
//========================================================================
//RequestMapping of Loggin a user
app.get('/Login',function(req,response){


fs.readFile("Login.html", 
  
  function(err, data){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(data);
  response.end();
  });
});


//RequestMapping of Registering a user in database=================================
app.get('/Registration',function(req,response){

// getting the paramerters
let  username=req.query.username;
let  password_ = req.query.password;

    connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password_], 
function(err, result) {
      if (err) throw err
	});

 response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end(username);
 
});
//========================================================================

//RequestMapping of checking credentials=================================
app.get('/credentials',function(req,response){

// getting the paramerters
let  username=req.query.username;
let  password_ = req.query.password;
 var match=false;

   
   
    connection.query('SELECT * from users where username = ?',[username], 
	function(err, result) {
      if (err) throw err
	 if(result.length>0)
		checkMatch(response,result[0].password==password_,username);

});

 
});
//========================================================================

function checkMatch( response, myVal,user_id){
	match=myVal;
	userId = user_id;
	// data from chat
	var chatData=[];
	
	if (match){
		
		// retrieving the chat
		connection.query('SELECT * from chat',function(err,result){
			ret = [];
			if(err){
				return;
			}
			
			if(result!=""){
		    console.log('result: '+result[0].timestamp);
			var i;
			
			for (i=0; i<result.length;i++){
				ret.push(result[i]);
				
				
				
			}
			console.log(JSON.stringify(ret));

			
			}
		
		
		    chatData[1]=(ret);
		
		});
		
		
		  console.log('user: '+userId);
	  // response head
	  response.writeHead(200, {'Content-Type': 'text/html'});
	
	
	  fs.readFile("chat.html",'utf-8', 
  
    function(err, data){
		chatData[0]={user: userId};
		chatData=JSON.stringify(chatData);
    var name= ejs.render(data, {chatData, chatData});
    response.end(name);
  
  });
	}		  
    else{	
  fs.readFile("index.html",
  function(err, data){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(data);
  response.end();
  });
}	


// this function retrieves the chat from the SQL database
function retrieveChat(){
	
	var data;
	
	connection.query(' SELECT * from chat',function(result){
		data = result;
		console.log('result: '+result);

	});
	}
	   
}

server.listen(3030);