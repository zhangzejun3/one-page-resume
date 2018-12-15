var ws = require("nodejs-websocket")

var PORT = 8001

var clientCount = 0
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++
	conn.nickname = 'user' + clientCount
	broadcast(conn.nickname+' comes in')
	conn.on("text", function (str) {
		console.log("Received "+str)
		broadcast(str)
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		broadcast(conn.nickname + ' left')
    })
    conn.on("error", function (error) {
        console.log("handle error")
        console.log(error)
	})
}).listen(PORT)

console.log("websocket server listening on port" + PORT)

function broadcast(str){
	server.connections.forEach((connection)=>{
		connection.sendText(str)
	})
}