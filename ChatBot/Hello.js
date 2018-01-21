/*Hello word program*/ 
var http = require("http");
var fs = require("fs");
console.log("This is my first node app");


http.createServer(

function(request,response){

//response.writeHead(200,{'Content-Type':'text/plain'});
//response.end('hello wolrd\n');
  fs.readFile("index.html", 
  
  function(err, data){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(data);
  response.end();
});


}).listen(8081);

console.log("The server listening at http://127.0.0.1:8081/");