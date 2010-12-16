// Editable settings:
var httpPort = 80;   // Port to view the map (i.e http://server.com:80)
var udpPort  = 8081; // Port for OOSocks in gmod to send to.

var sys = require("sys"),  
    http = require("http"),  
    url = require("url"),  
    path = require("path"),  
    fs = require("fs"),
	io = require('socket.io')
	dgram = require("dgram");
	
var server = http.createServer( serverCallback );
server.listen( 8080 );
function serverCallback( request, response ){
	var uri = url.parse(request.url).pathname;
	if(uri == "/"){ uri = "/index.html"; }
	var filename = path.join(process.cwd(), uri);
	fs.readFile( filename, "binary", function(err, file) {
		if (err) {
			response.writeHead(500, {"Content-Type": "text/plain"});  
			response.write(err + "\n");  
			response.end();  
		} else {
			response.writeHead(200);  
			response.write(file, "binary");  
			response.end();
		}
	});
}

udpServerPath = "/tmp/dgram_server_sock";
var udpServer = dgram.createSocket( "udp4" );
udpServer.on( "message", function(msg, rinfo){
	var jsonData = JSON.parse(msg)
	//sys.puts("got: " + JSON.stringify( jsonData ) + " from " + rinfo.address);
	socket.broadcast( JSON.stringify( jsonData ) );
	//udpServer.send( 'recieved', 0, msg.length, 37777, rinfo.address);
});
udpServer.bind( 8081 ); 

var socket = io.listen( server );
socket.on( 'connection', function(client){
	
	client.on( 'message', function(data){
		sys.puts( data );
		client.send( data );
	} );
	
} );

