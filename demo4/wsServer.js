var ws = require("nodejs-websocket")

var PORT = 8001

var clientCount = 0
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
	console.log("New connection")
	clientCount++
	conn.nickname = 'user' + clientCount
	var message = {}
	message.type = 'enter'
	message.data = conn.nickname+' comes in'
	broadcast(JSON.stringify(message))
	conn.on("text", function (str) {
		console.log("Received " + str)
		var message = {}
		message.type = 'message'
		message.data = `${conn.nickname} says: ${str}`
		broadcast(JSON.stringify(message))
	})
	conn.on("close", function (code, reason) {
		console.log("Connection closed")
		var message = {}
		message.type = 'leave'
		message.data = conn.nickname + ' left'
		broadcast(JSON.stringify(message))
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