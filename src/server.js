/*
 * Web socket server that relays any message it receives to all connected clients with the exception of the sender
*/

const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8081 })

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    console.log(`relaying message: ${message}`)
    wss.clients.forEach(function each (client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
    console.log('received: %s', message)
  })
})
